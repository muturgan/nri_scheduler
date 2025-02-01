pub fn init_static() {
	crate::auth::init_static();
	crate::dto::init_static();

	#[cfg(debug_assertions)]
	crate::vite::init_static();
}
