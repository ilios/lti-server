.PHONY: build-DashboardFunction build-LoginFunction build-PayloadFunction

install: package.json
	pnpm --version || npm install -g pnpm
	pnpm install --prod --ignore-scripts

build-DashboardFunction: install
	pnpx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js

build-LoginFunction: install
	pnpx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js

build-PayloadFunction: install
	pnpx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js
