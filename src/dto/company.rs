use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct NewCompanyDto {
	pub name: String,
	pub system: String,
	pub description: Option<String>,
}
