FactoryBot.define do
  factory :meal do
    name { Faker::Food.dish }
    description { Faker::Food.description }
    price { Faker::Commerce.price(range: 5..30.0) }
    image_url { Faker::Internet.url(host: 'example.com', path: "/images/#{rand(1000)}.jpg") }
    rating { rand(1.0..5.0).round(1) }
    association :category
  end
end