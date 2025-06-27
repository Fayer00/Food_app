class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :reviews, dependent: :destroy
  has_many :wishlist_items, dependent: :destroy

  validates :email, presence: true, uniqueness: { case_sensitive: false }

  def admin?
    admin
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[created_at email id updated_at]
  end
end