.PHONY: build-DashboardFunction build-LoginFunction build-PayloadFunction


install: package.json
	npm install --production
	npm install --no-save esbuild

build-DashboardFunction: install
	npx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js

build-LoginFunction: install
	npx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js

build-PayloadFunction: install
	npx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js
