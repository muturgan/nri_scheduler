use sqlx::{PgPool, postgres::PgPoolOptions};

use crate::config;

pub async fn create_db_connection() -> PgPool {
	let database_url = config::get_db_config();
	let pool = PgPoolOptions::new()
		.max_connections(config::get_db_max_pool_size())
		.connect(&database_url)
		.await
		.expect(":( Failed to connect to the database");
	println!(":) Connection to the database is successful");

	sqlx::migrate!("./migrations")
		.run(&pool)
		.await
		.expect(":( Migrations failed");
	println!(":) Migrations finished");

	return pool;
}
