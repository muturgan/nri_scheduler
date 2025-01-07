#![allow(clippy::upper_case_acronyms)]
use serde::{Deserialize, Deserializer, Serialize, Serializer, de::Error as _};

#[allow(non_camel_case_types)]
#[derive(Debug, PartialEq)]
pub enum EScenarioStatus {
	SCENARIO_SUCCESS,
	UNAUTHORIZED,
	SCENARIO_FAIL,
	SYSTEM_ERROR,
	SESSION_EXPIRED,
}

impl<'de> Deserialize<'de> for EScenarioStatus {
	fn deserialize<D>(deserializer: D) -> Result<EScenarioStatus, D::Error>
	where
		D: Deserializer<'de>,
	{
		match u8::deserialize(deserializer)? {
			1 => Ok(EScenarioStatus::SCENARIO_SUCCESS),
			2 => Ok(EScenarioStatus::UNAUTHORIZED),
			3 => Ok(EScenarioStatus::SCENARIO_FAIL),
			4 => Ok(EScenarioStatus::SYSTEM_ERROR),
			5 => Ok(EScenarioStatus::SESSION_EXPIRED),
			_ => Err(D::Error::custom("incorrect scenario status")),
		}
	}
}

impl Serialize for EScenarioStatus {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: Serializer,
	{
		let numval: u8 = match self {
			EScenarioStatus::SCENARIO_SUCCESS => 1,
			EScenarioStatus::UNAUTHORIZED => 2,
			EScenarioStatus::SCENARIO_FAIL => 3,
			EScenarioStatus::SYSTEM_ERROR => 4,
			EScenarioStatus::SESSION_EXPIRED => 5,
		};
		return serializer.serialize_u8(numval);
	}
}
