use chrono::NaiveDateTime;
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct NewEventDto {
	pub company: Uuid,
	pub location: Option<Uuid>,
	pub date: NaiveDateTime,
}
