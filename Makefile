include .env
export $(shell sed 's/=.*//' .env)

.PHONY: openapi
openapi:
	@docker run --rm --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/local" \
		openapitools/openapi-generator-cli:v6.0.1 generate \
		-i /local/api/openapi/user.yml \
		-g typescript-axios \
		-o /local/src/openapi/user
	@docker run --rm --user $(shell id -u):$(shell id -g) -v "$(shell pwd):/local" \
		openapitools/openapi-generator-cli:v6.0.1 generate \
		-i /local/api/openapi/mobile.yml \
		-g typescript-axios \
		-o /local/src/openapi/mobile

.PHONY: build
build:
	@npx eas-cli build --platform android --profile preview