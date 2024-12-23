mod errors;
mod response;
mod scenario_status;

pub use errors::AppError;
pub use response::AppResponse;
pub use scenario_status::EScenarioStatus;

pub type AppResult = Result<AppResponse, AppError>;
pub type CoreResult<T = ()> = Result<T, AppError>;
