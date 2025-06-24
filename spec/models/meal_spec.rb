require 'rails_helper'

RSpec.describe Meal, type: :model do
  it { should belong_to(:category) }
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:api_id) }
  it { should validate_presence_of(:image_url) }
  it { should validate_presence_of(:price) }
end