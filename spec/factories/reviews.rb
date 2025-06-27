FactoryBot.define do
  factory :review do
    title { Faker::Lorem.sentence(word_count: 3) }
    rating { rand(1..5) }
    content { Faker::Lorem.paragraph }
    approved { false }
    association :user
    
    # We need to handle the polymorphic association
    trait :for_meal do
      association :reviewable, factory: :meal
    end
    
    trait :for_category do
      association :reviewable, factory: :category
    end
    
    trait :approved do
      approved { true }
    end
    
    after(:build) do |review|
      if review.reviewable.nil?
        review.reviewable = create(:meal)
      end
    end
  end
end