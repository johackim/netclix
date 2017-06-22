.PHONY: build test

install:
	@ npm i

build:
	@ mkdir -p build
	@ ./node_modules/.bin/babel src/ --out-dir build/ --compact true
	@ chmod +x build/netclix.js

run:
	@ ./node_modules/.bin/babel-node src/netclix.js

debug:
	@ DEBUG=all ./node_modules/.bin/babel-node src/netclix.js

test: ## Run unit tests
	@ NODE_ENV=test ./node_modules/.bin/mocha -t 9999999 --compilers js:babel-core/register --require babel-polyfill test/setup.js test/specs/*.spec.js

deploy:
	@ npm publish

lint:
	@ ./node_modules/.bin/eslint src/

lint-fix:
	@ ./node_modules/.bin/eslint --fix src/
