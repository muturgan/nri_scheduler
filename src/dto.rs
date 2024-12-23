use ::std::error::Error;
use axum::{
	Json, RequestExt, async_trait,
	extract::{FromRequest, Request, rejection::JsonRejection},
};
use derive_masked::DebugMasked;
use serde::{
	Deserialize, Deserializer,
	de::{DeserializeOwned, Error as _},
};

use crate::system_models::AppError;

#[derive(DebugMasked)]
pub struct RegistrationDto {
	pub nickname: String,
	pub email: String,
	#[masked]
	pub password: String,
}

impl<'de> Deserialize<'de> for RegistrationDto {
	fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
	where
		D: Deserializer<'de>,
	{
		#[derive(Deserialize)]
		struct PlainBody {
			nickname: String,
			email: String,
			password: String,
		}

		let PlainBody {
			nickname,
			email,
			password,
		} = PlainBody::deserialize(deserializer)?;

		if nickname.is_empty() {
			return Err(D::Error::custom("Введено некорректное имя"));
		}
		if email.is_empty() {
			return Err(D::Error::custom("Введен некорректный email"));
		}
		if password.is_empty() {
			return Err(D::Error::custom("Введен некорректный пароль"));
		}

		Ok(Self {
			nickname,
			email,
			password,
		})
	}
}

#[derive(DebugMasked)]
pub struct SignInDto {
	pub email: String,
	#[masked]
	pub password: String,
}

impl<'de> Deserialize<'de> for SignInDto {
	fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
	where
		D: Deserializer<'de>,
	{
		#[derive(Deserialize)]
		struct PlainBody {
			email: String,
			password: String,
		}

		let PlainBody { email, password } = PlainBody::deserialize(deserializer)?;

		if email.is_empty() {
			return Err(D::Error::custom("Введен некорректный email"));
		}
		if password.is_empty() {
			return Err(D::Error::custom("Введен некорректный пароль"));
		}

		Ok(Self { email, password })
	}
}

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
