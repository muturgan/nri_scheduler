use ::std::error::Error;
use axum::{
	Json, RequestExt, async_trait,
	extract::{FromRequest, Request, rejection::JsonRejection},
};
use serde::de::DeserializeOwned;

use crate::system_models::AppError;

pub struct Dto<T>(pub T);

#[async_trait]
impl<T, S> FromRequest<S> for Dto<T>
where
	T: 'static + DeserializeOwned,
	S: Send + Sync,
{
	type Rejection = AppError;

	async fn from_request(req: Request, _: &S) -> Result<Self, Self::Rejection> {
		let body = req.extract::<Json<T>, _>().await;
		match body {
			Err(err) => Err(handle_json_rejection(err)),
			Ok(Json(dto)) => Ok(Dto(dto)),
		}
	}
}

fn handle_json_rejection(err: JsonRejection) -> AppError {
	return match err {
		JsonRejection::JsonDataError(data_err) => match data_err.source() {
			Some(source_err) => AppError::ScenarioError(
				format!("Передано некорректное тело запроса: {source_err}"),
				None,
			),
			None => AppError::ScenarioError(String::from("Передано некорректное тело запроса"), None),
		},

		JsonRejection::JsonSyntaxError(_) => {
			AppError::ScenarioError(String::from("Передано некорректное тело запроса"), None)
		}

		JsonRejection::MissingJsonContentType(_) => AppError::ScenarioError(
			String::from("Пожалуйста, укажите заголовок `Content-Type: application/json`"),
			None,
		),

		JsonRejection::BytesRejection(_) => {
			AppError::system_error("Не удалось прочитать тело запроса")
		}

		non_exhaustive => AppError::system_error(non_exhaustive),
	};
}
