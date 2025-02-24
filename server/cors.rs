use axum::{
	body::Body,
	http::{HeaderValue, Request, header},
	middleware::Next,
	response::Response,
};

pub(super) async fn cors_middleware(req: Request<Body>, next: Next) -> Response {
	let origin = req
		.headers()
		.get(header::ORIGIN)
		.and_then(|origin| match origin.to_str() {
			Err(_) => None,
			Ok(origin) => Some(origin.to_string()),
		});

	let origin_parts = origin.as_ref().map(|orig| orig.split(':'));

	let mut res = next.run(req).await;

	if let Some(mut origin_parts) = origin_parts {
		if origin_parts.next() == Some("http") && origin_parts.next() == Some("//localhost") {
			if let Some(port) = origin_parts
				.next()
				.and_then(|port| match port.parse::<u16>() {
					Err(_) => None,
					Ok(port) => Some(port),
				}) {
				let origin = format!("http://localhost:{port}");

				if let Ok(origin) = HeaderValue::from_str(&origin) {
					res.headers_mut()
						.append(header::ACCESS_CONTROL_ALLOW_ORIGIN, origin);

					res.headers_mut().append(
						header::ACCESS_CONTROL_ALLOW_METHODS,
						HeaderValue::from_str("GET,POST").unwrap(),
					);

					res.headers_mut().append(
						header::ACCESS_CONTROL_ALLOW_CREDENTIALS,
						HeaderValue::from_str("true").unwrap(),
					);
				}
			}
		}
	}

	res
}
