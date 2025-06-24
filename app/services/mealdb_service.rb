require 'httparty'
require 'redis'

class MealdbService
  include HTTParty
  base_uri 'https://www.themealdb.com/api/json/v1/1'

  def self.fetch_categories
    # Cache categories for 24 hours
    Rails.cache.fetch("categories", expires_in: 24.hours) do
      response = get("/categories.php")
      if response.success?
        response.parsed_response["categories"]
      else
        []
      end
    end
  end

  def self.fetch_meals_by_category(category_name)
    # Cache meals for a category for 24 hours
    Rails.cache.fetch("meals_#{category_name}", expires_in: 24.hours) do
      response = get("/filter.php", query: { c: category_name })
      if response.success?
        response.parsed_response["meals"] || []
      else
        []
      end
    end
  end
end