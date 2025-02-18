use ::std::sync::Arc;
use axum::extract::State;

use crate::{
	dto::{Dto, location::NewLocationDto},
	repository::Repository,
	system_models::{AppResponse, AppResult},
};

pub(crate) async fn add_location(
	State(repo): State<Arc<Repository>>,
	Dto(body): Dto<NewLocationDto>,
) -> AppResult {
	let new_loc_id = repo
		.add_location(&body.name, &body.address, &body.description)
		.await?;

	return Ok(AppResponse::scenario_success(
		"Локация успешно добавлена",
		new_loc_id.to_api(),
	));
}
