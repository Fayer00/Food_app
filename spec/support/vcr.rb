require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = "spec/vcr_cassettes"
  config.hook_into :webmock
  config.configure_rspec_metadata!
  # Allow VCR to ignore requests to the Stripe API for payment tests
  config.ignore_hosts 'api.stripe.com'
end