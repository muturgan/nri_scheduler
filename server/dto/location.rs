use serde::Deserialize;

#[derive(Deserialize)]
pub(crate) struct NewLocationDto {
	pub name: String,
	pub address: Option<String>,
	pub description: Option<String>,
}
