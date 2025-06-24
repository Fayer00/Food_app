require 'rails_helper'

RSpec.describe Meal, type: :model do
  it { should belong_to(:category) }
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:api_id) }
  it { should validate_presence_of(:image_url) }
  it { should validate_presence_of(:price) }


  it { should validate_presence_of(:rating) }
  it { should validate_numericality_of(:rating).is_greater_than_or_equal_to(1).is_less_than_or_equal_to(5) }
end