require 'rails_helper'

RSpec.describe "Api::V1::Meals", type: :request do
  let(:category) { create(:category) }
  let!(:meal1) { create(:meal, category: category, name: 'AAA', price: 10.0) }
  let!(:meal2) { create(:meal, category: category, name: 'BBB', price: 20.0) }

  describe "GET /index" do
    it "returns all meals" do
      get '/api/v1/meals', as: :json
      expect(response).to be_successful
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(2)
    end

    it 'filters meals by search term' do
      get api_v1_meals_path, params: { search: 'AAA' }, as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(1)
      expect(json_response.first['name']).to eq('AAA')
    end

    it 'sorts meals by price ascending' do
      get api_v1_meals_path, params: { sort_by: 'price', sort_dir: 'asc' }, as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.first['name']).to eq('AAA')
    end

    it 'sorts meals by price descending' do
      get api_v1_meals_path, params: { sort_by: 'price', sort_dir: 'desc' }, as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.first['name']).to eq('BBB')
    end
  end
end