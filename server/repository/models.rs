use chrono::{DateTime, Utc};
use derive_masked::DebugMasked;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(DebugMasked, Deserialize, Serialize, FromRow)]
pub(crate) struct UserForAuth {
	pub id: Uuid,
	#[masked]
	pub pw_hash: String,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct User {
	pub id: Uuid,
	pub nickname: String,
	pub phone: Option<String>,
	pub email: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Company {
	pub id: Uuid,
	pub master: Uuid,
	pub name: String,
	pub system: String,
	pub description: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Location {
	pub id: Uuid,
	pub name: String,
	pub address: Option<String>,
	pub description: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Event {
	pub id: Uuid,
	pub company: Uuid,
	pub location: Uuid,
	pub date: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Application {
	pub id: Uuid,
	pub player: Uuid,
	pub event: Uuid,
	pub approval: Option<bool>,
}
