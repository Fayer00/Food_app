require 'rails_helper'

RSpec.describe Review, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
    it { should validate_presence_of(:rating) }
    it { should validate_numericality_of(:rating).is_greater_than_or_equal_to(1).is_less_than_or_equal_to(5) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:reviewable) }
  end

  describe 'default values' do
    it 'sets approved to false by default' do
      review = Review.new
      expect(review.approved).to eq(false)
    end
  end

  describe 'scopes' do
    let!(:approved_review) { create(:review, approved: true) }
    let!(:unapproved_review) { create(:review, approved: false) }

    it 'returns only approved reviews with approved scope' do
      expect(Review.approved).to include(approved_review)
      expect(Review.approved).not_to include(unapproved_review)
    end
  end
end