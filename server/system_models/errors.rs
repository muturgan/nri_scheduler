use ::std::{
	error::Error,
	fmt::{Display, Formatter, Result as FmtResult},
};
use axum::response::{IntoResponse, Response};
use serde_json::Error as JsonSerializationError;

use super::AppResponse;

#[derive(Debug)]
pub(crate) enum AppError {
	UnauthorizedError(String),
	ScenarioError(String, Option<String>),
	SystemError(String),
	SessionExpired,
}

impl Display for AppError {
	fn fmt(&self, f: &mut Formatter<'_>) -> FmtResult {
		return match self {
			AppError::UnauthorizedError(msg) => {
				write!(f, "UnauthorizedError: {msg}")
			}
			AppError::ScenarioError(msg, ctx) => {
				let ctx_str = match ctx {
					Some(str) => format!(" ({str})"),
					None => String::default(),
				};
				write!(f, "ScenarioError: {msg}{ctx_str}")
			}
			AppError::SystemError(msg) => {
				write!(f, "SystemError: {msg}")
			}
			AppError::SessionExpired => {
				write!(f, "SessionExpired")
			}
		};
	}
}

impl Error for AppError {}

impl AppError {
	pub fn unauthorized(message: impl Into<String>) -> Self {
		AppError::UnauthorizedError(message.into())
	}

	pub fn scenario_error(msg: impl ToString, ctx: Option<impl ToString>) -> Self {
		AppError::ScenarioError(msg.to_string(), ctx.map(|c| c.to_string()))
	}

	pub fn system_error<S: ToString>(msg: S) -> Self {
		AppError::SystemError(msg.to_string())
	}
}

impl From<JsonSerializationError> for AppError {
	fn from(err: JsonSerializationError) -> Self {
		return AppError::system_error(err);
	}
}

impl IntoResponse for AppError {
	fn into_response(self) -> Response {
		AppResponse::from(self).into_response()
	}
}

impl<T> From<AppError> for Result<T, AppError> {
	fn from(err: AppError) -> Self {
		return Err(err);
	}
}
