pub mod companies;
pub mod events;
pub mod locations;

use ::std::sync::Arc;
use axum::{
	Extension,
	extract::State,
	http::{HeaderValue, header},
	response::{IntoResponse, Response},
};
use uuid::Uuid;

use crate::{
	auth, config,
	dto::{
		Dto,
		auth::{RegistrationDto, SignInDto},
	},
	repository::Repository,
	system_models::{AppError, AppResponse, AppResult},
};

pub async fn registration(
	State(repo): State<Arc<Repository>>,
	Dto(body): Dto<RegistrationDto>,
) -> AppResult {
	repo
		.registration(&body.nickname, &body.email, &body.password)
		.await?;

	return AppResponse::user_registered();
}

pub async fn sign_in(State(repo): State<Arc<Repository>>, Dto(body): Dto<SignInDto>) -> Response {
	let user = match repo.get_user_for_signing_in(&body.email).await {
		Ok(Some(user)) => user,
		Ok(None) => return AppError::unauthorized("Неверный пароль").into_response(),
		Err(err) => return err.into_response(),
	};

	if auth::verify_password(&body.password, user.pw_hash)
		.await
		.is_err()
	{
		return AppError::unauthorized("Неверный пароль").into_response();
	};

	let jwt = match auth::generate_jwt(user.id) {
		Err(err) => return err.into_response(),
		Ok(jwt) => jwt,
	};

	let (cookie_key, secure) = config::get_cookie_params();

	let auth_cookie = format!("{cookie_key}={}; SameSite; {secure}HttpOnly", jwt);

	let Ok(cookie_val) = HeaderValue::from_str(&auth_cookie) else {
		return AppError::system_error("Ошибка установки cookie").into_response();
	};

	let mut res = AppResponse::scenario_success("Успешная авторизация", None).into_response();
	res.headers_mut().append(header::SET_COOKIE, cookie_val);
	res
}

pub async fn who_i_am(Extension(user_id): Extension<Uuid>) -> impl IntoResponse {
	format!("my id is {user_id}")
}
