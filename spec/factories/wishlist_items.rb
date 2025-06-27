FactoryBot.define do
  factory :wishlist_item do
    association :user
    
    trait :for_meal do
      association :wishlistable, factory: :meal
    end

    after(:build) do |wishlist_item|
      if wishlist_item.wishlistable.nil?
        wishlist_item.wishlistable = create(:meal)
      end
    end
  end
end