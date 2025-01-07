use ::std::env::var as readEnvVar;
use axum::{
	BoxError,
	body::Body,
	http::{Request, StatusCode},
	response::Response,
};

pub async fn proxy_to_vite(req: Request<Body>) -> Response {
	fetch_vite(req).await.unwrap_or_else(|err| {
		Response::builder()
			.status(StatusCode::INTERNAL_SERVER_ERROR)
			.body(Body::from(err.to_string()))
			.unwrap()
	})
}

async fn fetch_vite(req: Request<Body>) -> Result<Response, BoxError> {
	let path = req.uri().path();

	let vite_port = readEnvVar("VITE_PORT")
		.expect("VITE_PORT environment variable is not defined")
		.parse::<u16>()
		.expect("VITE_PORT is not a correct u16");

	let vite_url = format!("http://127.0.0.1:{vite_port}{path}");

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
