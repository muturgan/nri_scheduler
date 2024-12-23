use ::std::sync::Arc;
use axum::{
	Router, middleware,
	routing::{get, post},
};

use crate::{auth, handler as H, repository::Repository};

pub fn create_router(repo: Arc<Repository>) -> Router {
	return Router::new()
		.nest(
			"/api",
			Router::new()
				.route("/registration", post(H::registration))
				.route("/signin", post(H::sign_in))
				.merge(
					Router::new()
						.route("/check", get(H::who_i_am))
						.layer(middleware::from_fn(auth::auth_middleware)),
				),
		)
		.with_state(repo);
}
