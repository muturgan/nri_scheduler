use ::std::{
	error::Error,
	fmt::{Display, Formatter, Result as FmtResult},
};
use axum::response::{IntoResponse, Response};

use super::AppResponse;

#[derive(Debug)]
pub enum AppError {
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
	pub fn unauthorized<S: Into<String>>(message: S) -> Self {
		AppError::UnauthorizedError(message.into())
	}

	pub fn promo_not_exists() -> Self {
		AppError::ScenarioError(String::from("Данный промокод не существует"), None)
	}

	pub fn promo_already_activated() -> Self {
		AppError::ScenarioError(
			String::from("Данный промокод уже был активирован ранее"),
			None,
		)
	}

	pub fn scenario_error(msg: impl ToString, ctx: Option<impl ToString>) -> Self {
		AppError::ScenarioError(msg.to_string(), ctx.map(|c| c.to_string()))
	}

	pub fn system_error<S: ToString>(msg: S) -> Self {
		AppError::SystemError(msg.to_string())
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
