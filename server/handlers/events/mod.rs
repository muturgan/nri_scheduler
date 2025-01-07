use ::std::sync::Arc;
use axum::{Extension, extract::State};
use futures::try_join;
use uuid::Uuid;

use crate::{
	dto::{
		Dto,
		event::{NewEventDto, ReadEventsDto},
	},
	repository::Repository,
	system_models::{AppError, AppResponse, AppResult},
};

pub async fn read_event(
	State(repo): State<Arc<Repository>>,
	Extension(_user_id): Extension<Option<Uuid>>,
	Dto(query): Dto<ReadEventsDto>,
) -> AppResult {
	let events = repo.read_events(query.date_from, query.date_to).await?;

	let json_value = serde_json::to_value(&events)?;

	return Ok(AppResponse::scenario_success(
		"Список событий",
		Some(json_value),
	));
}

pub async fn add_event(
	State(repo): State<Arc<Repository>>,
	Extension(user_id): Extension<Uuid>,
	Dto(body): Dto<NewEventDto>,
) -> AppResult {
	try_join!(
		check_company(body.company, user_id, repo.clone()),
		check_location(body.location, repo.clone()),
	)?;

	let new_evt_id = repo
		.add_event(body.company, &body.location, body.date)
		.await?;

	return Ok(AppResponse::scenario_success(
		"Событие успешно создано",
		new_evt_id.to_api(),
	));
}

async fn check_company(
	company_id: Uuid,
	user_id: Uuid,
	repo: Arc<Repository>,
) -> Result<(), AppError> {
	let Some(company) = repo.get_company_by_id(company_id).await? else {
		return AppError::scenario_error("Компания не найдена", Some(company_id.to_string())).into();
	};

	if company.master != user_id {
		return AppError::scenario_error("Вы не можете управлять данной компанией", None::<&str>)
			.into();
	}

	Ok(())
}

async fn check_location(location_id: Option<Uuid>, repo: Arc<Repository>) -> Result<(), AppError> {
	if let Some(l_id) = location_id {
		let may_be_location = repo.get_location_by_id(l_id).await?;
		if may_be_location.is_none() {
			return AppError::scenario_error("Локация не найдена", Some(l_id.to_string())).into();
		}
	}

	Ok(())
}
