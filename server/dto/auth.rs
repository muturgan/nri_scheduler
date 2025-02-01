use ::std::sync::LazyLock;
use derive_masked::DebugMasked;
use regex::Regex;
use serde::{Deserialize, Deserializer, de::Error as _};

static EMAIL_REGEX: LazyLock<Regex> = LazyLock::new(|| {
	Regex::new(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").expect("Email regex should build without errors")
});

pub(super) fn init_static() {
	let _ = *EMAIL_REGEX;
	println!("+ a email regex is ok");
}

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
		if !EMAIL_REGEX.is_match(&email) {
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

		if !EMAIL_REGEX.is_match(&email) {
			return Err(D::Error::custom("Введен некорректный email"));
		}
		if password.is_empty() {
			return Err(D::Error::custom("Введен некорректный пароль"));
		}

		Ok(Self { email, password })
	}
}
