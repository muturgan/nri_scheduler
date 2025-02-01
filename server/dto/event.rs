use chrono::{DateTime, FixedOffset};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct ReadEventsDto {
	pub date_from: DateTime<FixedOffset>,
	pub date_to: DateTime<FixedOffset>,

	#[serde(default)]
	pub master: Option<Uuid>,
	#[serde(default)]
	pub location: Option<Uuid>,
	#[serde(default)]
	pub appied: Option<bool>,
	#[serde(default)]
	pub not_rejected: Option<bool>,
	#[serde(default)]
	pub imamaster: Option<bool>,
}

#[derive(Deserialize)]
pub struct NewEventDto {
	pub company: Uuid,
	pub location: Option<Uuid>,
	pub date: DateTime<FixedOffset>,
}
