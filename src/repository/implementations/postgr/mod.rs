mod pool;

use sqlx::{Error as EqlxError, PgPool};

use super::super::Store;
use crate::{
	auth,
	repository::models::UserForAuth,
	shared::RecordId,
	system_models::{AppError, CoreResult},
};

const DUPLICATE_KEY: &str = "duplicate key";

impl From<EqlxError> for AppError {
	fn from(err: EqlxError) -> Self {
		return AppError::system_error(err);
	}
}

#[derive(Clone)]
pub struct PostgresStore {
	pool: PgPool,
}

impl PostgresStore {
	pub async fn new() -> Self {
		let pool = pool::create_db_connection().await;
		Self { pool }
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

	async fn close(&self) {
		self.pool.close().await;
	}
}
