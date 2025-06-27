class ReviewSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :rating, :created_at, :updated_at, :user_id, :user_email
  
  belongs_to :user
  
  def user_email
    object.user&.email
  end

  class UserSerializer < ActiveModel::Serializer
    attributes :id, :email
  end
end