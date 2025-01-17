use chrono::{DateTime, Utc};
use derive_masked::DebugMasked;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, types::Json as SqlxJson};
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
	pub company: String,
	pub master: String,
	pub location: String,
	pub date: DateTime<Utc>,
	pub players: SqlxJson<Vec<String>>,
	pub you_applied: bool,
	pub your_approval: Option<bool>,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct EventForApplying {
	pub id: Uuid,
	pub you_are_master: bool,
	pub already_applied: bool,
}
