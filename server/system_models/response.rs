use axum::{
	Json,
	http::StatusCode,
	response::{IntoResponse, Response},
};
use serde::{Deserialize, Serialize};

use super::AppResult;
use crate::system_models::{errors::AppError, scenario_status::EScenarioStatus};

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct AppResponse {
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

	pub(super) fn unauthorized<S: Into<String>>(
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

	pub(super) fn session_expired() -> Self {
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
