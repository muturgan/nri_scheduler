mod errors;
mod response;
mod scenario_status;
mod serving_error;

pub(crate) use errors::AppError;
pub(crate) use response::AppResponse;
pub use serving_error::ServingError;

pub(crate) type AppResult = Result<AppResponse, AppError>;
pub(crate) type CoreResult<T = ()> = Result<T, AppError>;
