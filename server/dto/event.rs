use chrono::{DateTime, FixedOffset};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct ReadEventsDto {
	pub date_from: DateTime<FixedOffset>,
	pub date_to: DateTime<FixedOffset>,
}

#[derive(Deserialize)]
pub struct NewEventDto {
	pub company: Uuid,
	pub location: Option<Uuid>,
	pub date: DateTime<FixedOffset>,
}

#[derive(Deserialize)]
pub struct ApplyventDto {
	pub event: Uuid,
}
