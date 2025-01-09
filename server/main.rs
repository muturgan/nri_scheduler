use ::std::sync::Arc;
use nri_scheduler::{
	config, graceful_shutdown::shutdown_signal, repository::Repository, router,
	system_models::ServingError,
};
use tokio::net::TcpListener as AsyncTcpListener;

#[tokio::main]
async fn main() -> Result<(), ServingError> {
	println!("hi!");
	let repo = Repository::new().await?;
	let repo = Arc::new(repo);
	let app = router::create_router(repo.clone());

	let addr = config::get_http_host_to_serve();
	let listener = AsyncTcpListener::bind(addr).await?;

	println!(":) Server started successfully");

	axum::serve(listener, app)
		.with_graceful_shutdown(shutdown_signal(repo))
		.await?;

	Ok(())
}
