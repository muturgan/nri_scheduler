use std::{
	fs::read_to_string as read_file_to_string,
	time::{Duration, SystemTime, UNIX_EPOCH},
};

use argon2::{
	Argon2,
	password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use axum::{
	body::Body,
	http::Request,
	middleware::Next,
	response::{IntoResponse, Response},
};
use axum_extra::extract::cookie::CookieJar;
use jsonwebtoken::{
	Algorithm::ES256, DecodingKey, EncodingKey, Header as JwtHeader, TokenData, Validation,
	decode as decode_and_verify, encode,
};
use lazy_static::lazy_static;
use rand::Rng;
use serde::{Deserialize, Serialize};
use tokio::time::sleep;
use uuid::Uuid;

use crate::{
	config,
	system_models::{AppError, AppResponse, CoreResult},
};

lazy_static! {
	// default params
	// alg: argon2id
	// version: 19
	// params: m=19456,t=2,p=1
	// prefix: $argon2id$v=19$m=19456,t=2,p=1$ (len 31, salt+delimiter+hash len 66)
	// $argon2id$v=19$m=19456,t=2,p=1$goAxCzRvjpKz3c2yj1xIdQ$j39vSFfn0rSE67hsPJ58qz3TdvEr1kzFLUf8oIL7g0E
	// pref.len = 31
	// suf.len = 66
	static ref ARGON: Argon2<'static> = Argon2::default();

	static ref PRIVATE_KEY: EncodingKey = EncodingKey::from_ec_pem(
		read_file_to_string("private_key.pem")
			.expect("can't read a private key")
			.as_bytes()
	)
	.expect("can't parse private key");

	static ref PUBLIC_KEY: DecodingKey = DecodingKey::from_ec_pem(
		read_file_to_string("public_key.pem")
			.expect("can't read a public key")
			.as_bytes()
	)
	.expect("can't parse a public key");

	static ref JWT_HEADER: JwtHeader = JwtHeader::new(ES256);
	static ref JWT_VALIDATION: Validation = Validation::new(ES256);
}

#[derive(Debug, Deserialize, Serialize)]
struct Claims {
	sub: Uuid,
	exp: u64,
}

pub(crate) fn hash_password(password: &str) -> CoreResult<String> {
	let salt = SaltString::generate(&mut OsRng);
	let password_hash = ARGON
		.hash_password(password.as_bytes(), &salt)
		.map_err(|e| {
			eprintln!("Ошибка хэширования пароля: {e}");
			AppError::ScenarioError(String::from("Ошибка хэширования пароля"), None)
		})?;

	let suffix = &password_hash.to_string()[31..];
	Ok(suffix.to_string())
}

pub(crate) async fn verify_password(password: &str, password_hash: String) -> CoreResult {
	let full_hash = format!("$argon2id$v=19$m=19456,t=2,p=1${password_hash}");
	let parsed_hash = PasswordHash::new(&full_hash).map_err(|e| {
		eprintln!("Ошибка парсига пароля: {e}");
		AppError::system_error("Ошибка парсига пароля")
	})?;

	ARGON
		.verify_password(password.as_bytes(), &parsed_hash)
		.map_err(|e| {
			println!("Неверный пароль: {e}");
			AppError::unauthorized("Неверный пароль")
		})?;

	let random_millis: u64 = rand::thread_rng().gen_range(1..=50);
	sleep(Duration::from_millis(random_millis)).await;

	Ok(())
}

pub(crate) async fn auth_middleware(
	cookie_jar: CookieJar,
	mut req: Request<Body>,
	next: Next,
) -> Response {
	let (cookie_key, _) = config::get_cookie_params();

	let cookie_token = cookie_jar.get(cookie_key).map(|cookie| cookie.value());

	let Some(jwt) = cookie_token else {
		return AppError::unauthorized("Необходима авторизация").into_response();
	};

	let Ok(TokenData { claims, .. }) =
		decode_and_verify::<Claims>(jwt, &PUBLIC_KEY, &JWT_VALIDATION)
	else {
		return AppError::unauthorized("Неверный пароль").into_response();
	};

	let Ok(now) = SystemTime::now()
		.duration_since(UNIX_EPOCH)
		.map(|dur| dur.as_secs())
	else {
		return AppResponse::system_error("Time went backwards", None).into_response();
	};

	if now >= claims.exp {
		return AppError::SessionExpired.into_response();
	}

	req.extensions_mut().insert(claims.sub);

	next.run(req).await
}

pub(crate) async fn optional_auth_middleware(
	cookie_jar: CookieJar,
	mut req: Request<Body>,
	next: Next,
) -> Response {
	let (cookie_key, _) = config::get_cookie_params();

	let cookie_token = cookie_jar.get(cookie_key).map(|cookie| cookie.value());

	let Some(jwt) = cookie_token else {
		req.extensions_mut().insert(None::<Uuid>);

		return next.run(req).await;
	};

	let Ok(TokenData { claims, .. }) =
		decode_and_verify::<Claims>(jwt, &PUBLIC_KEY, &JWT_VALIDATION)
	else {
		return AppError::unauthorized("Неверный пароль").into_response();
	};

	let Ok(now) = SystemTime::now()
		.duration_since(UNIX_EPOCH)
		.map(|dur| dur.as_secs())
	else {
		return AppResponse::system_error("Time went backwards", None).into_response();
	};

	if now >= claims.exp {
		return AppError::SessionExpired.into_response();
	}

	req.extensions_mut().insert(Some(claims.sub));

	next.run(req).await
}

pub(crate) fn generate_jwt(user_id: Uuid) -> CoreResult<String> {
	// Время истечения срока действия токена (текущее время + 1 час)
	let expiration_time = SystemTime::now()
		.duration_since(UNIX_EPOCH)
		.map_err(|_| AppError::system_error("Time went backwards"))?
		.as_secs()
		+ 3600;

	let claims = Claims {
		sub: user_id,
		exp: expiration_time,
	};

	let token = encode(&JWT_HEADER, &claims, &PRIVATE_KEY).map_err(|e| {
		println!("Ошибка формирования JWT: {e}");
		AppError::system_error("Ошибка формирования JWT")
	})?;

	Ok(token)
}
