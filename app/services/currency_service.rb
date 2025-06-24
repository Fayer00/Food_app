require 'httparty'

class CurrencyService
  include HTTParty
  base_uri 'http://api.exchangeratesapi.io/v1'

  def self.fetch_rates
    # Cache rates for 12 hours
    Rails.cache.fetch("exchange_rates", expires_in: 12.hours) do
      api_key = Rails.application.credentials.exchangerates_api_key
      response = get("/latest", query: { access_key: api_key, symbols: 'USD,EUR,GBP,CLP' }) # Add other currencies as needed
      if response.success? && response.parsed_response["success"]
        response.parsed_response["rates"]
      else
        Rails.logger.error "Failed to fetch exchange rates: #{response.body}"
        nil
      end
    end
  end

  def self.update_rates
    rates = fetch_rates
    if rates
      # The free plan's base currency is EUR. We need to convert from EUR to USD first.
      usd_rate = rates['USD']
      rates.each do |currency, rate|
        # Convert from EUR to the target currency, then normalize against USD
        Money.default_bank.add_rate('USD', currency, (rate / usd_rate))
      end
      Money.default_bank.add_rate('USD', 'USD', 1) # Ensure USD to USD is 1
    end
  end

  def self.convert(amount_usd, to_currency)
    update_rates unless Money.default_bank.rates.any?
    Money.new(amount_usd * 100, "USD").exchange_to(to_currency).to_f
  end
end