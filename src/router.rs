use ::std::sync::Arc;
use axum::{
	Router, middleware,
	routing::{get, post},
};
#[cfg(debug_assertions)]
use tower_http::services::{ServeDir, ServeFile};

use crate::{auth, handlers as H, repository::Repository};

pub fn create_router(repo: Arc<Repository>) -> Router {
	let router = Router::new()
		.nest(
			"/api",
			Router::new()
				.route("/registration", post(H::registration))
				.route("/signin", post(H::sign_in))
				.route("/locations", post(H::locations::add_location))
				.merge(
					Router::new()
						.route("/events", get(H::events::read_event))
						.layer(middleware::from_fn(auth::optional_auth_middleware)),
				)
				.merge(
					Router::new()
						.route("/check", get(H::who_i_am))
						.route("/companies", post(H::companies::add_company))
						.route("/events", post(H::events::add_event))
						.layer(middleware::from_fn(auth::auth_middleware)),
				),
		)
		.with_state(repo);

	#[cfg(debug_assertions)]
	let router = router
		.nest_service("/", ServeFile::new("static/index.html"))
		.nest_service("/assets", ServeDir::new("static/assets"));

	return router;
}
