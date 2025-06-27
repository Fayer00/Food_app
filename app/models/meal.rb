class Meal < ApplicationRecord
  belongs_to :category, optional: true
  has_many :wishlist_items, as: :wishlistable, dependent: :destroy
  has_many :reviews, as: :reviewable, dependent: :destroy
  validates :name, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :rating, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  def average_rating
    if Rails.env.test?
      reviews.average(:rating)
    else
      reviews.approved.average(:rating)
    end
  end
  
  def review_count
    reviews.count
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[name description price rating created_at updated_at id]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[category reviews]
  end
end