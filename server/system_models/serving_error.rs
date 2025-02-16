use ::std::{
	error::Error as StdError,
	fmt::{Display, Formatter, Result as FmtResult},
	io::Error as IoError,
};
use sqlx::{Error as SqlxError, migrate::MigrateError};

#[derive(Debug)]
pub enum ServingError {
	ConnectionError(SqlxError),
	MigrationError(MigrateError),
	IoError(IoError),
}

impl Display for ServingError {
	fn fmt(&self, f: &mut Formatter<'_>) -> FmtResult {
		match self {
			Self::ConnectionError(err) => err.fmt(f),
			Self::MigrationError(err) => err.fmt(f),
			Self::IoError(err) => err.fmt(f),
		}
	}
}

impl StdError for ServingError {}

impl From<SqlxError> for ServingError {
	fn from(err: SqlxError) -> Self {
		Self::ConnectionError(err)
	}
}

impl From<MigrateError> for ServingError {
	fn from(err: MigrateError) -> Self {
		Self::MigrationError(err)
	}
}

impl From<IoError> for ServingError {
	fn from(err: IoError) -> Self {
		Self::IoError(err)
	}
}
