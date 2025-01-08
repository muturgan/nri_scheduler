mod errors;
mod response;
mod scenario_status;
mod serving_error;

pub use errors::AppError;
pub use response::AppResponse;
pub use scenario_status::EScenarioStatus;
pub use serving_error::ServingError;

pub type AppResult = Result<AppResponse, AppError>;
pub type CoreResult<T = ()> = Result<T, AppError>;
