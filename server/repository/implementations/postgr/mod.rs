mod pool;

use chrono::{DateTime, FixedOffset};
use sqlx::{Error as EqlxError, PgPool};
use uuid::Uuid;

use super::super::Store;
use crate::{
	auth,
	repository::models::{Company, Event, EventForApplying, Location, UserForAuth},
	shared::RecordId,
	system_models::{AppError, CoreResult, ServingError},
};

const DUPLICATE_KEY: &str = "duplicate key";

impl From<EqlxError> for AppError {
	fn from(err: EqlxError) -> Self {
		return AppError::system_error(err);
	}
}

pub struct PostgresStore {
	pool: PgPool,
}

impl PostgresStore {
	pub async fn new() -> Result<Self, ServingError> {
		let pool = pool::create_db_connection().await?;
		Ok(Self { pool })
	}
}

impl Store for PostgresStore {
	async fn registration(&self, nickname: &str, email: &str, password: &str) -> CoreResult {
		let hashed_pass = auth::hash_password(password)?;

		let query_result =
			sqlx::query("INSERT INTO users (nickname, email, pw_hash) values ($1, $2, $3);")
				.bind(nickname)
				.bind(email)
				.bind(hashed_pass)
				.execute(&self.pool)
				.await;

		query_result.map_err(|err| {
			let err_str = err.to_string();
			if err_str.contains(DUPLICATE_KEY) {
				AppError::scenario_error("Пользователь с данным email уже существует", email.into())
			} else {
				AppError::system_error(err_str)
			}
		})?;

		Ok(())
	}

	async fn get_user_for_signing_in(&self, email: &str) -> CoreResult<Option<UserForAuth>> {
		let may_be_user =
			sqlx::query_as::<_, UserForAuth>("SELECT id, pw_hash FROM users WHERE email = $1;")
				.bind(email)
				.fetch_optional(&self.pool)
				.await?;

		Ok(may_be_user)
	}

	async fn get_location_by_id(&self, location_id: Uuid) -> CoreResult<Option<Location>> {
		let may_be_location = sqlx::query_as::<_, Location>("SELECT * FROM locations WHERE id = $1;")
			.bind(location_id)
			.fetch_optional(&self.pool)
			.await?;

		Ok(may_be_location)
	}

	async fn add_location(
		&self,
		name: &str,
		address: &Option<String>,
		descr: &Option<String>,
	) -> CoreResult<RecordId> {
		let query_result = sqlx::query_scalar::<_, RecordId>(
			"INSERT INTO locations (name, address, description) values ($1, $2, $3) returning id;",
		)
		.bind(name)
		.bind(address)
		.bind(descr)
		.fetch_one(&self.pool)
		.await;

		let new_loc_id = query_result.map_err(|err| {
			let err_str = err.to_string();
			if err_str.contains(DUPLICATE_KEY) {
				AppError::scenario_error("Локация с данным названием уже существует", name.into())
			} else {
				AppError::system_error(err_str)
			}
		})?;

		Ok(new_loc_id)
	}

	async fn get_company_by_id(&self, company_id: Uuid) -> CoreResult<Option<Company>> {
		let may_be_company = sqlx::query_as::<_, Company>("SELECT * FROM companies WHERE id = $1;")
			.bind(company_id)
			.fetch_optional(&self.pool)
			.await?;

		Ok(may_be_company)
	}

	async fn add_company(
		&self,
		master: Uuid,
		name: &str,
		system: &str,
		descr: &Option<String>,
	) -> CoreResult<RecordId> {
		let new_comp_id = sqlx::query_scalar::<_, RecordId>(
			"INSERT INTO companies (master, name, system, description) values ($1, $2, $3, $4) returning id;",
		)
		.bind(master)
		.bind(name)
		.bind(system)
		.bind(descr)
		.fetch_one(&self.pool)
		.await?;

		Ok(new_comp_id)
	}

	async fn read_events_list(
		&self,
		date_from: DateTime<FixedOffset>,
		date_to: DateTime<FixedOffset>,
		player_id: Option<Uuid>,
	) -> CoreResult<Vec<Event>> {
		let events = sqlx::query_as::<_, Event>(
			"SELECT
					e.id
					, c.name AS company
					, m.nickname AS master
					, l.name AS location
					, e.date
					, jsonb_agg(u.nickname) AS players
					, bool_or(y.id is not null) AS you_applied
					, y.approval AS your_approval
				FROM events e
				INNER JOIN companies c
					ON c.id = e.company
				INNER JOIN locations l
					ON l.id = e.location
				INNER JOIN users m
					ON m.id = c.master
				LEFT JOIN applications y
					ON y.player = $3 and y.event = e.id
				LEFT JOIN applications ap
					ON ap.event = e.id
				LEFT JOIN users u
					ON u.id = ap.player
				WHERE e.date >= $1 AND e.date <= $2
				GROUP BY e.id, c.name, m.nickname, l.name, e.date, y.approval;",
		)
		.bind(date_from)
		.bind(date_to)
		.bind(player_id)
		.fetch_all(&self.pool)
		.await?;

		Ok(events)
	}

	async fn read_event(
		&self,
		event_id: Uuid,
		player_id: Option<Uuid>,
	) -> CoreResult<Option<Event>> {
		let event = sqlx::query_as::<_, Event>(
			"SELECT
				e.id
				, c.name AS company
				, m.nickname AS master
				, l.name AS location
				, e.date
				, jsonb_agg(u.nickname) AS players
				, bool_or(y.id is not null) AS you_applied
				, y.approval AS your_approval
			FROM events e
			INNER JOIN companies c
				ON c.id = e.company
			INNER JOIN locations l
				ON l.id = e.location
			INNER JOIN users m
				ON m.id = c.master
			LEFT JOIN applications y
				ON y.player = $2 and y.event = e.id
			LEFT JOIN applications ap
				ON ap.event = e.id
			LEFT JOIN users u
				ON u.id = ap.player
			WHERE e.id = $1
			GROUP BY e.id, c.name, m.nickname, l.name, e.date, y.approval;",
		)
		.bind(event_id)
		.bind(player_id)
		.fetch_optional(&self.pool)
		.await?;

		Ok(event)
	}

	async fn get_event_for_applying(
		&self,
		event_id: Uuid,
		player_id: Uuid,
	) -> CoreResult<Option<EventForApplying>> {
		let event = sqlx::query_as::<_, EventForApplying>(
			"select
				e.id
				, (c.master = $2) as you_are_master
				, bool_or(a.id is not null) AS already_applied
			from events e
			inner join companies c
				on c.id = e.company
			left join applications a
				on a.event = e.id
				and a.player = $2
			where e.id = $1
			group by e.id, c.master;",
		)
		.bind(event_id)
		.bind(player_id)
		.fetch_optional(&self.pool)
		.await?;

		Ok(event)
	}

	async fn apply_event(&self, event_id: Uuid, player_id: Uuid) -> CoreResult<RecordId> {
		let new_app_id = sqlx::query_scalar::<_, RecordId>(
			"INSERT INTO applications (event, player) values ($1, $2) returning id;",
		)
		.bind(event_id)
		.bind(player_id)
		.fetch_one(&self.pool)
		.await?;

		Ok(new_app_id)
	}

	async fn add_event(
		&self,
		company: Uuid,
		location: &Option<Uuid>,
		date: DateTime<FixedOffset>,
	) -> CoreResult<RecordId> {
		let new_evt_id = sqlx::query_scalar::<_, RecordId>(
			"INSERT INTO events (company, location, date) values ($1, $2, $3) returning id;",
		)
		.bind(company)
		.bind(location)
		.bind(date)
		.fetch_one(&self.pool)
		.await?;

		Ok(new_evt_id)
	}

	async fn close(&self) {
		self.pool.close().await;
	}
}
