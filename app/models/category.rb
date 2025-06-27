class Category < ApplicationRecord
  has_many :meals, dependent: :nullify
  has_many :reviews, as: :reviewable, dependent: :destroy
  
  validates :name, presence: true, uniqueness: true

  def self.ransackable_attributes(auth_object = nil)
    ["id", "name", "description", "image_url", "created_at", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["meals"]
  end

  def self.ransortable_attributes(auth_object = nil)
    ransackable_attributes(auth_object)
  end
end