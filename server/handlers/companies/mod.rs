use ::std::sync::Arc;
use axum::{Extension, extract::State};
use uuid::Uuid;

use crate::{
	dto::{Dto, company::NewCompanyDto},
	repository::Repository,
	system_models::{AppResponse, AppResult},
};

pub(crate) async fn add_company(
	State(repo): State<Arc<Repository>>,
	Extension(user_id): Extension<Uuid>,
	Dto(body): Dto<NewCompanyDto>,
) -> AppResult {
	let new_comp_id = repo
		.add_company(user_id, &body.name, &body.system, &body.description)
		.await?;

	return Ok(AppResponse::scenario_success(
		"Компания успешно создана",
		new_comp_id.to_api(),
	));
}
