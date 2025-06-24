class Meal < ApplicationRecord
  belongs_to :category
  validates :name, :api_id, :image_url, :price, presence: true
end