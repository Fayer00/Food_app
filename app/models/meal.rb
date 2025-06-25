class Meal < ApplicationRecord
  belongs_to :category
  validates :name, :api_id, :image_url, :price, :rating, presence: true

  validates :rating, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  def self.ransackable_attributes(auth_object = nil)
    ["id", "name", "api_id", "image_url", "price", "rating", "description", "created_at", "updated_at", "category_id"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["category"]
  end
end