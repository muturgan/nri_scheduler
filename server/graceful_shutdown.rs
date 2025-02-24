use ::std::sync::Arc;
#[cfg(feature = "https")]
use axum_server::Handle;

use crate::repository::Repository;

#[cfg(not(feature = "https"))]
pub async fn shutdown_signal(repo: Arc<Repository>) {
	let shutdown_fn = || async {
		repo.close().await;
	};

	let ctrl_c = || async {
		tokio::signal::ctrl_c()
			.await
			.expect("failed to install Ctrl+C handler");

		shutdown_fn().await;
	};

	#[cfg(unix)]
	let sigint = || async {
		tokio::signal::unix::signal(tokio::signal::unix::SignalKind::interrupt())
			.expect("failed to install SIGINT signal handler")
			.recv()
			.await;

		shutdown_fn().await;
	};

	#[cfg(not(unix))]
	let sigterm = std::future::pending::<()>();

	#[cfg(unix)]
	let sigterm = || async {
		tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
			.expect("failed to install SIGTERM signal handler")
			.recv()
			.await;

		shutdown_fn().await;
	};

	#[cfg(not(unix))]
	let sigterm = std::future::pending::<()>();

	tokio::select! {
		() = ctrl_c() => {},
		() = sigint() => {},
		() = sigterm() => {},
	}
}

#[cfg(feature = "https")]
pub async fn shutdown_signal(repo: Arc<Repository>, handle: Handle) {
	let shutdown_fn = || async {
		repo.close().await;
	};

	let ctrl_c = || async {
		tokio::signal::ctrl_c()
			.await
			.expect("failed to install Ctrl+C handler");

		shutdown_fn().await;
	};

	#[cfg(unix)]
	let sigint = || async {
		tokio::signal::unix::signal(tokio::signal::unix::SignalKind::interrupt())
			.expect("failed to install SIGINT signal handler")
			.recv()
			.await;

		shutdown_fn().await;
	};

	#[cfg(not(unix))]
	let sigterm = std::future::pending::<()>();

	#[cfg(unix)]
	let sigterm = || async {
		tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
			.expect("failed to install SIGTERM signal handler")
			.recv()
			.await;

		shutdown_fn().await;
	};

	#[cfg(not(unix))]
	let sigterm = std::future::pending::<()>();

	tokio::select! {
		() = ctrl_c() => {},
		() = sigint() => {},
		() = sigterm() => {},
	};

	handle.graceful_shutdown(None);
}
