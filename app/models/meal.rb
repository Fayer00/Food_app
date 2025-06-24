class Meal < ApplicationRecord
  belongs_to :category
  validates :name, :api_id, :image_url, :price, :rating, presence: true

  validates :rating, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
end