source "https://rubygems.org"
git_source(:github) { |repo_name| "https://github.com/#{repo_name}.git" }

ruby "3.2.2"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.0.8"

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem "sprockets-rails"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

gem 'concurrent-ruby', '1.3.4'
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Use Redis caching
gem "redis", "~> 4.0"

# Hotwire's SPA-like page accelerator [https://turbo.hotwire.dev]
gem "turbo-rails"

# Hotwire's modest JavaScript framework [https://stimulus.hotwire.dev]
gem "stimulus-rails"

# Use tailwindcss-rails gem to build modern UIs
gem "tailwindcss-rails"

gem "jsbundling-rails"
gem "money"

# Group for development and testing
group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "bootsnap", require: false
  gem "rspec-rails", "~> 6.0.0"
  gem "factory_bot_rails"
  gem "faker"
end

group :development do
  # Use console on exceptions pages
  gem "web-console"
  gem "listen", "~> 3.3"
  gem 'foreman'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

# To make HTTP requests
gem "httparty"