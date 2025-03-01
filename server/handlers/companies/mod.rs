use ::std::sync::Arc;
use axum::{
	Extension,
	extract::{Path, State},
};
use uuid::Uuid;

use crate::{
	dto::{
		Dto,
		company::{NewCompanyDto, ReadCompaniesDto},
	},
	repository::Repository,
	system_models::{AppResponse, AppResult},
};

pub(crate) async fn get_company_by_id(
	State(repo): State<Arc<Repository>>,
	Path(company_id): Path<Uuid>,
) -> AppResult {
	let maybe_company = repo.get_company_by_id(company_id).await?;

	Ok(match maybe_company {
		None => AppResponse::scenario_fail("Кампания не найдена", None),
		Some(company) => {
			let payload = serde_json::to_value(company)?;
			AppResponse::scenario_success("Информация о кампании", Some(payload))
		}
	})
}

pub(crate) async fn get_my_companies(
	State(repo): State<Arc<Repository>>,
	Extension(user_id): Extension<Uuid>,
	Dto(query): Dto<ReadCompaniesDto>,
) -> AppResult {
	let my = repo.get_my_companies(query, user_id).await?;

	let json_value = serde_json::to_value(my)?;

	return Ok(AppResponse::scenario_success(
		"Список кампаний мастера",
		Some(json_value),
	));
}

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
		new_comp_id.into_api(),
	));
}
