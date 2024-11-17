#!/bin/bash

origin_url_path=$(cat .git/config | grep git@github.com | cut -d ":" -f 2 | cut -d "." -f 1)
repo_data=$(curl -s https://api.github.com/repos/$origin_url_path)

name=$(echo $repo_data | awk -F '"name": "' '{print $2}' | awk -F '"' '{print $1}')
description=$(echo $repo_data | awk -F '"description": "' '{print $2}' | awk -F '"' '{print $1}')

sed -i '' "s/my-rust-template/$name/" scripts.sh

sed -i '' "s/name = \"my-rust-template\"/name = \"$name\"/" Cargo.toml
sed -i '' "s/name = \"my-rust-template\"/name = \"$name\"/" Cargo.lock

sed -i '' "s/description = \"template for new rust projects\"/description = \"$description\"/" Cargo.toml

sed -i '' "s/# my-rust-template/# $name/" README.md
sed -i '' '3,7d' README.md
sed -i '' "s/template for new rust projects/$description/" README.md

rm rewrite.sh
