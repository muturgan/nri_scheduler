pub(crate) mod auth;
mod common;
pub(crate) mod company;
pub(crate) mod event;
pub(crate) mod location;

pub(crate) use common::Dto;

pub(super) fn init_static() {
	auth::init_static();
	common::init_static();
}
