mod pool;

use sqlx::{Error as EqlxError, PgPool};

use super::super::Store;
use crate::{
	auth,
	repository::models::UserForAuth,
	shared::RecordId,
	system_models::{AppError, CoreResult},
};

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

		sqlx::query("INSERT INTO users (nickname, email, pw_hash) values ($1, $2, $3);")
			.bind(nickname)
			.bind(email)
			.bind(hashed_pass)
			.execute(&self.pool)
			.await?;

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
		let new_loc_id = sqlx::query_scalar::<_, RecordId>(
			"INSERT INTO locations (name, address, description) values ($1, $2, $3) returning id;",
		)
		.bind(name)
		.bind(address)
		.bind(descr)
		.fetch_one(&self.pool)
		.await?;

		Ok(new_loc_id)
	}

	async fn close(&self) {
		self.pool.close().await;
	}
}
