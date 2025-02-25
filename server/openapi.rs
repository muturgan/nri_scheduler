use ::std::fs;
use utoipa::openapi::OpenApi;

pub(crate) fn get_schema() -> OpenApi {
	let str =
		fs::read_to_string("openapi.json").expect("Не удалось прочитать с диска файл OpenAPI схемы");

	#[cfg(feature = "https")]
	let str = str.replace("authorization", "__Secure-authorization");

	serde_json::from_str::<OpenApi>(&str)
		.unwrap_or_else(|err| panic!("Ошибка парсинга OpenAPI схемы: {err}"))
}
