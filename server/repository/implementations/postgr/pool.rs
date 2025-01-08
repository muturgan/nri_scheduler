use sqlx::{PgPool, postgres::PgPoolOptions};

use crate::{config, system_models::ServingError};

pub async fn create_db_connection() -> Result<PgPool, ServingError> {
	let database_url = config::get_db_config();
	let pool = PgPoolOptions::new()
		.max_connections(config::get_db_max_pool_size())
		.connect(&database_url)
		.await?;
	println!(":) Connection to the database is successful");

	sqlx::migrate!("./migrations").run(&pool).await?;
	println!(":) Migrations finished");

	return Ok(pool);
}
