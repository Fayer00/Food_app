require 'rails_helper'

RSpec.describe Meal, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:price) }
    it { should validate_numericality_of(:price).is_greater_than(0) }
  end

  describe 'associations' do
    it { should have_many(:reviews).dependent(:destroy) }
    it { should belong_to(:category).optional(true) }
  end

  describe 'average_rating' do
    let(:meal) { create(:meal) }
    
    context 'when there are no reviews' do
      it 'returns nil' do
        expect(meal.average_rating).to be_nil
      end
    end
    
    context 'when there are reviews' do
      before do
        create(:review, reviewable: meal, rating: 4, approved: true)
        create(:review, reviewable: meal, rating: 5, approved: true)
        create(:review, reviewable: meal, rating: 3, approved: true)
      end
      
      it 'returns the average rating' do
        expect(meal.average_rating).to eq(4.0)
      end
    end
  end
end