use ::std::sync::LazyLock;
use axum::{
	BoxError,
	body::Body,
	http::{Request, StatusCode},
	response::{IntoResponse, Response},
};
use reqwest::Url;

static VITE_PORT: LazyLock<u16> = LazyLock::new(|| {
	let env_var =
		::std::env::var("VITE_PORT").expect("VITE_PORT environment variable is not defined");

	env_var
		.parse::<u16>()
		.unwrap_or_else(|_| panic!("VITE_PORT is not a correct u16 ({env_var})"))
});

pub(super) fn init_static() {
	let _ = *VITE_PORT;
	println!("+ vite static values are ok");
}

pub(super) async fn proxy_to_vite(req: Request<Body>) -> Response {
	fetch_vite(req).await.unwrap_or_else(|err| {
		(
			StatusCode::INTERNAL_SERVER_ERROR,
			Body::from(err.to_string()),
		)
			.into_response()
	})
}

async fn fetch_vite(req: Request<Body>) -> Result<Response, BoxError> {
	let vite_url = Url::parse(&format!(
		"http://127.0.0.1:{}{}",
		*VITE_PORT,
		req.uri().path()
	))?;

	let vite_res = reqwest::get(vite_url).await?;

	let res = vite_res
		.headers()
		.iter()
		.fold(
			Response::builder().status(vite_res.status()),
			|builder, (k, v)| builder.header(k, v),
		)
		.body(Body::from_stream(vite_res.bytes_stream()))?;

	Ok(res)
}
