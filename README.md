# README

To run this:

* docker-compose build
* docker-compose run --rm web rails db:create db:migrate db:seed
* docker-compose up
* url: http://localhost:3000/

## Running Tests

Before running tests, make sure all dependencies are installed:

* Install test dependencies: `docker-compose run --rm test bundle install`
* Prepare DB for tests: ` docker-compose run --rm test rails db:test:prepare    `
* Run all tests: `docker-compose run --rm test rspec`
* Run specific tests: `docker-compose run --rm test rspec path/to/spec`

## Development Commands

* Install gems: docker-compose run --rm web bundle install
* Install test gems: docker-compose run --rm test bundle install
* Update gems: docker-compose run --rm web bundle update
* Generate a new migration: docker-compose run --rm web rails generate migration MigrationName
* Run specific tests: `docker-compose run --rm test rspec path/to/spec`

## Troubleshooting

If you encounter issues with missing gems in the test environment:
* Rebuild the test container: docker-compose build test
* Install gems with a specific path: docker-compose run --rm test bundle install --path vendor/bundle
* Check that volumes are properly configured in docker-compose.yml

### Common Docker Test Issues

1. **Missing Gems**: If you see "Could not find [gem names] in locally installed gems":
   ```bash
   docker-compose run --rm test bundle install
   ```