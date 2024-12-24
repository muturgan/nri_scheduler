use ::std::{io::Error as IoError, sync::Arc};
use nri_scheduler::{config, graceful_shutdown::shutdown_signal, repository::Repository, router};

#[tokio::main]
async fn main() -> Result<(), IoError> {
	let repo = Repository::new().await;
	let repo = Arc::new(repo);
	let app = router::create_router(repo.clone());

	let addr = config::get_http_host_to_serve();
	let listener = tokio::net::TcpListener::bind(addr).await?;

	println!(":) Server started successfully");

	axum::serve(listener, app)
		.with_graceful_shutdown(shutdown_signal(repo))
		.await
}
