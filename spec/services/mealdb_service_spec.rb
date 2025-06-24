require 'rails_helper'

RSpec.describe MealdbService, type: :service do
  describe '.fetch_categories', :vcr do
    it 'fetches and returns categories from TheMealDB API' do
      categories = MealdbService.fetch_categories
      expect(categories).to be_an(Array)
      expect(categories.first).to have_key("strCategory")
    end
  end

  describe '.fetch_meals_by_category', :vcr do
    it 'fetches and returns meals for a given category' do
      meals = MealdbService.fetch_meals_by_category('Seafood')
      expect(meals).to be_an(Array)
      expect(meals.first).to have_key("strMeal")
      expect(meals.first).to have_key("idMeal")
    end
  end
end