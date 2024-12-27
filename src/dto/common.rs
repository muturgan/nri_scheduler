use ::std::error::Error;
use axum::{
	Json, RequestExt, async_trait,
	extract::{FromRequest, Request, rejection::JsonRejection},
	http::Method,
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
		match req.method() {
			&Method::GET => {
				let query = req.uri().query().unwrap_or_default();
				let params = serde_urlencoded::from_str::<'_, T>(query);
				match params {
					Err(_) => Err(AppError::ScenarioError(
						"Переданы некорректные параметры запроса".into(),
						None,
					)),
					Ok(dto) => Ok(Dto(dto)),
				}
			}
			_ => {
				let body = req.extract::<Json<T>, _>().await;
				match body {
					Err(err) => Err(handle_json_rejection(err)),
					Ok(Json(dto)) => Ok(Dto(dto)),
				}
			}
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
			None => AppError::ScenarioError("Передано некорректное тело запроса".into(), None),
		},

		JsonRejection::JsonSyntaxError(_) => {
			AppError::ScenarioError("Передано некорректное тело запроса".into(), None)
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
