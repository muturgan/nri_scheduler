use ::std::sync::Arc;
use axum::{
	Router, middleware,
	routing::{get, post},
};

#[cfg(feature = "vite")]
use crate::vite::proxy_to_vite;
use crate::{auth, handlers as H, repository::Repository};

pub fn create_router(repo: Arc<Repository>) -> Router {
	let router = Router::new()
		.nest(
			"/api",
			Router::new()
				.route("/registration", post(H::registration))
				.route("/signin", post(H::sign_in))
				.route("/logout", post(H::logout))
				.merge(
					Router::new()
						.route("/events", get(H::events::read_events_list))
						.route("/events/{id}", get(H::events::read_event))
						.layer(middleware::from_fn(auth::optional_auth_middleware)),
				)
				.merge(
					Router::new()
						.route("/check", get(H::who_i_am))
						.route("/profile", get(H::read_profile))
						.route("/locations", post(H::locations::add_location))
						.route("/companies", post(H::companies::add_company))
						.route("/events", post(H::events::add_event))
						.route("/events/apply/{id}", post(H::events::apply_event))
						.layer(middleware::from_fn(auth::auth_middleware)),
				),
		)
		.with_state(repo);

	#[cfg(feature = "vite")]
	let router = router.fallback(proxy_to_vite);

	return router;
}
