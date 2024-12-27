mod implementations;
pub mod models;

use chrono::NaiveDateTime;
use implementations::PostgresStore;
use models::{Company, Event, Location, UserForAuth};
use uuid::Uuid;

use crate::{shared::RecordId, system_models::CoreResult};

trait Store {
	async fn registration(&self, nickname: &str, email: &str, password: &str) -> CoreResult;
	async fn get_user_for_signing_in(&self, email: &str) -> CoreResult<Option<UserForAuth>>;

	async fn get_location_by_id(&self, location_id: Uuid) -> CoreResult<Option<Location>>;

	async fn add_location(
		&self,
		name: &str,
		address: &Option<String>,
		descr: &Option<String>,
	) -> CoreResult<RecordId>;

	async fn get_company_by_id(&self, company_id: Uuid) -> CoreResult<Option<Company>>;

	async fn add_company(
		&self,
		master: Uuid,
		name: &str,
		system: &str,
		descr: &Option<String>,
	) -> CoreResult<RecordId>;

	async fn read_events(
		&self,
		date_from: NaiveDateTime,
		date_to: NaiveDateTime,
	) -> CoreResult<Vec<Event>>;

	async fn add_event(
		&self,
		company: Uuid,
		location: &Option<Uuid>,
		date: NaiveDateTime,
	) -> CoreResult<RecordId>;

	async fn close(&self);
}

pub struct Repository {
	store: PostgresStore,
}

impl Repository {
	pub async fn new() -> Self {
		return Self {
			store: PostgresStore::new().await,
		};
	}

	pub(crate) async fn registration(
		&self,
		nickname: &str,
		email: &str,
		password: &str,
	) -> CoreResult {
		return self.store.registration(nickname, email, password).await;
	}

	pub(crate) async fn get_user_for_signing_in(
		&self,
		email: &str,
	) -> CoreResult<Option<UserForAuth>> {
		return self.store.get_user_for_signing_in(email).await;
	}

	pub(crate) async fn get_location_by_id(
		&self,
		location_id: Uuid,
	) -> CoreResult<Option<Location>> {
		return self.store.get_location_by_id(location_id).await;
	}

	pub(crate) async fn add_location(
		&self,
		name: &str,
		address: &Option<String>,
		descr: &Option<String>,
	) -> CoreResult<RecordId> {
		return self.store.add_location(name, address, descr).await;
	}

	pub(crate) async fn get_company_by_id(&self, company_id: Uuid) -> CoreResult<Option<Company>> {
		return self.store.get_company_by_id(company_id).await;
	}

	pub(crate) async fn add_company(
		&self,
		master: Uuid,
		name: &str,
		system: &str,
		descr: &Option<String>,
	) -> CoreResult<RecordId> {
		return self.store.add_company(master, name, system, descr).await;
	}

	pub(crate) async fn read_events(
		&self,
		date_from: NaiveDateTime,
		date_to: NaiveDateTime,
	) -> CoreResult<Vec<Event>> {
		return self.store.read_events(date_from, date_to).await;
	}

	pub(crate) async fn add_event(
		&self,
		company: Uuid,
		location: &Option<Uuid>,
		date: NaiveDateTime,
	) -> CoreResult<RecordId> {
		return self.store.add_event(company, location, date).await;
	}

	pub async fn close(&self) {
		return self.store.close().await;
	}
}
