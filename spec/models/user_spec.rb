require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
  end

  describe 'associations' do
    it { should have_many(:reviews).dependent(:destroy) }
  end

  describe 'admin role' do
    it 'returns true for admin? when user is an admin' do
      admin = create(:user, admin: true)
      expect(admin.admin?).to be true
    end

    it 'returns false for admin? when user is not an admin' do
      user = create(:user, admin: false)
      expect(user.admin?).to be false
    end
  end

  it "is not valid with an invalid email format" do
    user = User.new(email: "invalid_email", password: "password123")
    expect(user).not_to be_valid
    expect(user.errors[:email]).to include("is invalid")
  end

  it "is not valid without a password" do
    user = User.new(email: "test@example.com", password: nil)
    expect(user).not_to be_valid
    expect(user.errors[:password]).to include("can't be blank")
  end

  it "destroys associated wishlist items when user is deleted" do
    user = create(:user)
    wishlist_item1 = create(:wishlist_item, user: user)
    wishlist_item2 = create(:wishlist_item, user: user)
    
    expect { user.destroy }.to change(WishlistItem, :count).by(-2)
  end

  it "should correctly identify ransackable attributes for searching" do
    ransackable_attributes = User.ransackable_attributes
    
    expect(ransackable_attributes).to be_an(Array)
    expect(ransackable_attributes).to match_array(["created_at", "email", "id", "updated_at"])
  end

  it "is not valid with a duplicate email" do
    original_user = create(:user, email: "test@example.com")
    duplicate_user = User.new(email: "test@example.com", password: "password123")
    
    expect(duplicate_user).not_to be_valid
    expect(duplicate_user.errors[:email]).to include("has already been taken")
  end
end