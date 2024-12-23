mod implementations;
pub mod models;

use implementations::PostgresStore;
use models::UserForAuth;

use crate::system_models::CoreResult;

trait Store {
	async fn registration(&self, nickname: &str, email: &str, password: &str) -> CoreResult;
	async fn get_user_for_signing_in(&self, email: &str) -> CoreResult<Option<UserForAuth>>;

	async fn close(&self);
}

#[derive(Clone)]
pub struct Repository {
	store: PostgresStore,
}

impl Repository {
	pub async fn new() -> Self {
		return Self {
			store: PostgresStore::new().await,
		};
	}

	pub async fn registration(&self, nickname: &str, email: &str, password: &str) -> CoreResult {
		return self.store.registration(nickname, email, password).await;
	}

	pub(crate) async fn get_user_for_signing_in(
		&self,
		email: &str,
	) -> CoreResult<Option<UserForAuth>> {
		return self.store.get_user_for_signing_in(email).await;
	}

	pub async fn close(&self) {
		return self.store.close().await;
	}
}
