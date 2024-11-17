#!/bin/sh

build() {
	cargo build --release;
}

dev() {
	export $(cat .env | grep -v '^#' | xargs) && cargo run
}

start_release() {
	export $(cat .env | grep -v '^#' | xargs) && ./target/release/my-rust-template
}

start() {
	build;
	start_release;
}

test() {
	export $(cat .env | grep -v '^#' | xargs) && cargo test
}

bin() {
	export $(cat .env | grep -v '^#' | xargs) && cargo run --bin workflow
}

check() {
	(cargo check && echo "check is ok") || exit 1;
}

clippy() {
	(cargo clippy --all --all-features --tests -- -D warnings && echo "clippy is ok") || exit 1;
}

fmt() {
	(cargo +nightly fmt -- --check && echo "fmt is ok") || exit 1;
}

lint() {
	clippy && fmt;
}

full_check() {
	check && clippy && fmt;
}

"$@"
