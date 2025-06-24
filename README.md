# README

To run this:

* docker-compose build
* docker-compose run --rm web rails db:create db:migrate db:seed
* docker-compose up
* url: http://localhost:3000/
* run tests: docker-compose run --rm test
