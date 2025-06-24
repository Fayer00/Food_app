FactoryBot.define do
  factory :meal do
    association :category
    name { Faker::Food.dish }
    api_id { Faker::Number.unique.number(digits: 6).to_s }
    image_url { Faker::Internet.url }
    price { Faker::Commerce.price(range: 10.0..100.0) }


    rating { rand(1.0..5.0).round(1) }
  end
end