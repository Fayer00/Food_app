class WishlistItem < ApplicationRecord
  belongs_to :user
  belongs_to :wishlistable, polymorphic: true

  validates :user_id, uniqueness: { scope: [:wishlistable_id, :wishlistable_type] }

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "updated_at", "user_id", "wishlistable_id", "wishlistable_type"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["user", "wishlistable"]
  end
end