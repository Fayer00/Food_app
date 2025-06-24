FactoryBot.define do
  factory :category do
    name { Faker::Food.unique.ethnic_category }
    image_url { Faker::Internet.url }
    description { Faker::Lorem.paragraph }
  end
end