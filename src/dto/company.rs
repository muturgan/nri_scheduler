use serde::Deserialize;

#[derive(Deserialize)]
pub struct NewCompanyDto {
	pub name: String,
	pub system: String,
	pub description: Option<String>,
}
