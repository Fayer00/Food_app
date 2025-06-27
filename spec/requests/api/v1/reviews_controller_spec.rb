require 'rails_helper'

RSpec.describe Api::V1::ReviewsController, type: :request do
  let(:user) { create(:user) }
  let(:meal) { create(:meal) }
  let(:category) { create(:category) }
  let(:review_attributes) { attributes_for(:review, title: "Great meal!") }
  
  describe 'GET /api/v1/meals/:meal_id/reviews' do
    before do
      # Create reviews with different users
      3.times do
        create(:review, reviewable: meal, user: create(:user))
      end
    end
    
    it 'returns all reviews for a meal' do
      get api_v1_meal_reviews_path(meal), as: :json
      
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end
  
  describe 'GET /api/v1/categories/:category_id/reviews' do
    before do
      # Create reviews with different users
      3.times do
        create(:review, reviewable: category, user: create(:user))
      end
    end
    
    it 'returns all reviews for a category' do
      get api_v1_category_reviews_path(category), as: :json
      
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end
  
  describe 'GET /api/v1/reviews/:id' do
    let(:review) { create(:review, reviewable: meal, user: user) }
    
    it 'returns the requested review' do
      get api_v1_review_path(review), as: :json
      
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(review.id)
    end
  end
  
  describe 'POST /api/v1/meals/:meal_id/reviews' do
    context 'when user is authenticated' do
      before do
        sign_in user
      end
      
      it 'creates a new review' do
        expect {
          post api_v1_meal_reviews_path(meal), params: { review: review_attributes }, as: :json
        }.to change(Review, :count).by(1)
        
        expect(response).to have_http_status(:created)
      end
      
      it 'returns validation errors if invalid' do
        post api_v1_meal_reviews_path(meal), params: { review: { title: '' } }, as: :json
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('errors')
      end
    end
    
    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        post api_v1_meal_reviews_path(meal), params: { review: review_attributes }, as: :json
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'PATCH /api/v1/reviews/:id' do
    let(:review) { create(:review, reviewable: meal, user: user) }
    
    context 'when user is authenticated and is the author' do
      before do
        sign_in user
      end
      
      it 'updates the review' do
        patch api_v1_review_path(review), params: { review: { title: 'Updated Title' } }, as: :json
        
        expect(response).to have_http_status(:ok)
        expect(review.reload.title).to eq('Updated Title')
      end
    end
    
    context 'when user is not the author' do
      let(:other_user) { create(:user) }
      
      before do
        sign_in other_user
      end
      
      it 'returns forbidden status' do
        patch api_v1_review_path(review), params: { review: { title: 'Updated Title' } }, as: :json
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'DELETE /api/v1/reviews/:id' do
    let!(:review) { create(:review, reviewable: meal, user: user) }
    
    context 'when user is authenticated and is the author' do
      before do
        sign_in user
      end
      
      it 'deletes the review' do
        expect {
          delete api_v1_review_path(review), as: :json
        }.to change(Review, :count).by(-1)
        
        expect(response).to have_http_status(:no_content)
      end
    end
    
    context 'when user is not the author' do
      let(:other_user) { create(:user) }
      
      before do
        sign_in other_user
      end
      
      it 'returns forbidden status' do
        expect {
          delete api_v1_review_path(review), as: :json
        }.not_to change(Review, :count)
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end