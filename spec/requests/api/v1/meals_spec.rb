require 'rails_helper'

RSpec.describe "Api::V1::Meals", type: :request do
  let(:category) { create(:category) }
  let!(:meal1) { create(:meal, category: category, name: 'AAA', price: 10.0, rating: 5.0) }
  let!(:meal2) { create(:meal, category: category, name: 'BBB', price: 20.0, rating: 1.0) }

  describe "GET /index" do
    it "returns all meals" do
      get '/api/v1/meals', as: :json
      expect(response).to be_successful
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(2)
    end

    it 'filters meals by search term' do
      get '/api/v1/meals', params: { search: 'AAA' }, as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(1)
      expect(json_response.first['name']).to eq('AAA')
    end

    it 'sorts meals by price ascending' do
      get '/api/v1/meals', params: { sort_by: 'price', sort_dir: 'asc' }, as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.first['name']).to eq('AAA')
    end

    it 'sorts meals by rating descending' do
      get '/api/v1/meals', params: { sort_by: 'rating', sort_dir: 'desc' }, as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.first['name']).to eq('AAA')
    end
  end
end