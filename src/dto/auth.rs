use derive_masked::DebugMasked;
use serde::{Deserialize, Deserializer, de::Error as _};

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
