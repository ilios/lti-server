.PHONY: build-DashboardFunction build-LoginFunction build-PayloadFunction

build-DashboardFunction:
	npm install --production
	npm install --no-save esbuild
	npx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js

build-LoginFunction:
	npm install --production
	npm install --no-save esbuild
	npx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js

build-PayloadFunction:
	npm install --production
	npm install --no-save esbuild
	npx esbuild app.ts --bundle --platform=node --target=es2020 --external:@aws-sdk/client-s3 --external:@aws-sdk/client-dynamodb --minify --sourcemap --outfile=$(ARTIFACTS_DIR)/app.js
