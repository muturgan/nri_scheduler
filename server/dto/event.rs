use chrono::NaiveDateTime;
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct ReadEventsDto {
	pub date_from: NaiveDateTime,
	pub date_to: NaiveDateTime,
}

#[derive(Deserialize)]
pub struct NewEventDto {
	pub company: Uuid,
	pub location: Option<Uuid>,
	pub date: NaiveDateTime,
}
