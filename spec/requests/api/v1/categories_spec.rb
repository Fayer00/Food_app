require 'rails_helper'

RSpec.describe "Api::V1::Categories", type: :request do
  describe "GET /index" do
    let!(:categories) { create_list(:category, 5) }

    it "returns a successful response" do
      get '/api/v1/categories', as: :json
      expect(response).to be_successful
    end

    it "returns all categories" do
      get '/api/v1/categories', as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(5)
    end
  end
end