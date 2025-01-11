# nri_scheduler
my outstanding trpg scheduler

## steps to start a local development
- clone the repository ¯\\\_(ツ)_/¯
- exec `cp env.example .env`
- exec `cargo test` to enable git hooks
- fill the .env file with values
- exec `docker compose up` to start a database
- exec `./script.sh` to start an axum server
- exec `npm run dev` to start a client
- open a brouser at `http://localhost:{APP_PORT}` (to avoid cors problems for api calls)

## git hooks
remove a `target` directory (if exists) and run `cargo test` to enable git hooks.  
repeat it again to enable some changes in your hook files.
