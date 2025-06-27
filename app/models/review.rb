class Review < ApplicationRecord
  belongs_to :user
  belongs_to :reviewable, polymorphic: true
  
  has_rich_text :content
  
  validates :rating, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
  validates :content, presence: true
  validate :user_can_only_review_once
  validates :title, presence: true
  
  scope :recent, -> { order(created_at: :desc) }
  scope :highest_rated, -> { where(rating: 5) }
  scope :lowest_rated, -> { where(rating: 1) }
  scope :approved, -> { where(approved: true) }
  
  def self.ransackable_attributes(auth_object = nil)
    %w[id title rating created_at updated_at user_id reviewable_id reviewable_type]
  end
  
  def self.ransackable_associations(auth_object = nil)
    %w[user reviewable]
  end

  private

  def user_can_only_review_once
    if user && reviewable && Review.exists?(user: user, reviewable: reviewable) && new_record?
      errors.add(:user, "has already reviewed this item")
    end
  end
end