use axum::{
	Json,
	http::StatusCode,
	response::{IntoResponse, Response},
};
use serde::{Deserialize, Serialize};

use super::AppResult;
use crate::{
	repository::models,
	system_models::{errors::AppError, scenario_status::EScenarioStatus},
};

#[derive(Debug, Deserialize, Serialize)]
pub struct AppResponse {
	pub status: EScenarioStatus,
	pub result: String,
	pub payload: Option<serde_json::Value>,
}

impl AppResponse {
	fn new<S: Into<String>>(
		status: EScenarioStatus,
		result: S,
		payload: Option<serde_json::Value>,
	) -> Self {
		return Self {
			status,
			result: result.into(),
			payload,
		};
	}

	pub(crate) fn scenario_success<S: Into<String>>(
		result: S,
		payload: Option<serde_json::Value>,
	) -> Self {
		return Self::new(EScenarioStatus::SCENARIO_SUCCESS, result.into(), payload);
	}

	pub(crate) fn unauthorized<S: Into<String>>(
		result: S,
		payload: Option<serde_json::Value>,
	) -> Self {
		return Self::new(EScenarioStatus::UNAUTHORIZED, result.into(), payload);
	}

	pub(crate) fn scenario_fail<S: Into<String>>(
		result: S,
		payload: Option<serde_json::Value>,
	) -> Self {
		return Self::new(EScenarioStatus::SCENARIO_FAIL, result.into(), payload);
	}

	pub(crate) fn system_error<S: Into<String>>(
		result: S,
		payload: Option<serde_json::Value>,
	) -> Self {
		return Self::new(EScenarioStatus::SYSTEM_ERROR, result.into(), payload);
	}

	pub(crate) fn session_expired() -> Self {
		return Self::new(EScenarioStatus::SESSION_EXPIRED, "Session expired", None);
	}

	//  *********************************
	//  *                               *
	//  *       Scenario Success        *
	//  *                               *
	//  *********************************

	pub fn user_registered() -> AppResult {
		return Ok(Self::scenario_success(
			"Новый пользователь успешно зарегистрирован",
			None,
		));
	}

	pub fn promo_valid() -> AppResult {
		return Ok(Self::scenario_success("Промокод корректен", None));
	}

	pub fn promo_activated() -> AppResult {
		return Ok(Self::scenario_success("Промокод успешно активирован", None));
	}

	pub fn user_list(users: Vec<models::User>) -> AppResult {
		let payload = serde_json::json!(users);
		return Ok(Self::scenario_success(
			"Список пользователей",
			Some(payload),
		));
	}
}

impl IntoResponse for AppResponse {
	fn into_response(self) -> Response {
		(StatusCode::OK, Json(self)).into_response()
	}
}

impl From<AppError> for AppResponse {
	fn from(err: AppError) -> Self {
		match err {
			AppError::UnauthorizedError(result) => AppResponse::unauthorized(result, None),
			AppError::ScenarioError(result, payload) => {
				AppResponse::scenario_fail(result, payload.map(|p| serde_json::json!(p)))
			}
			AppError::SystemError(result) => AppResponse::system_error(result, None),
			AppError::SessionExpired => AppResponse::session_expired(),
		}
	}
}
