use axum::{
	http::{HeaderValue, header},
	response::Response,
};
use axum_extra::extract::cookie::{Cookie, CookieJar};

use crate::{
	auth::SESSION_LIFETIME,
	config,
	system_models::{AppError, CoreResult},
};

#[cfg(not(feature = "cors"))]
const SAME_SITE: &str = "SameSite; ";
#[cfg(feature = "cors")]
const SAME_SITE: &str = "";

pub(super) fn set_auth_cookie(response: &mut Response, jwt: &str) -> CoreResult {
	let (cookie_key, secure) = config::get_cookie_params();
	let auth_cookie = format!(
		"{cookie_key}={jwt}; {SAME_SITE}{secure}HttpOnly; path=/api; max-age={SESSION_LIFETIME}",
	);

	let cookie_val = HeaderValue::from_str(&auth_cookie)
		.map_err(|_| AppError::system_error("Ошибка установки cookie"))?;

	response
		.headers_mut()
		.append(header::SET_COOKIE, cookie_val);

	Ok(())
}

pub(super) fn remove_auth_cookie(response: &mut Response) -> CoreResult {
	let (cookie_key, secure) = config::get_cookie_params();
	let auth_cookie =
		format!("{cookie_key}=logout; {SAME_SITE}{secure}HttpOnly; path=/api; max-age=0");

	let cookie_val = HeaderValue::from_str(&auth_cookie)
		.map_err(|_| AppError::system_error("Ошибка установки cookie"))?;

	response
		.headers_mut()
		.append(header::SET_COOKIE, cookie_val);

	Ok(())
}

pub(super) fn extract_jwt_from_cookie(cookie_jar: &CookieJar) -> Option<&str> {
	let (cookie_key, _) = config::get_cookie_params();
	cookie_jar.get(cookie_key).map(Cookie::value)
}
