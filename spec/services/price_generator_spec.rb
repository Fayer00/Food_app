require 'rails_helper'

RSpec.describe PriceGenerator do
  describe '.generate' do
    it 'generates a price between $45 and $100 for Lamb' do
      price = PriceGenerator.generate('Lamb')
      expect(price).to be_between(45.0, 100.0)
    end

    it 'generates a price between $35 and $80 for Beef' do
      price = PriceGenerator.generate('Beef')
      expect(price).to be_between(35.0, 80.0)
    end

    it 'generates a price between $25 and $60 for Pork' do
      price = PriceGenerator.generate('Pork')
      expect(price).to be_between(25.0, 60.0)
    end

    it 'generates a price between $10 and $100 for other categories' do
      price = PriceGenerator.generate('Seafood')
      expect(price).to be_between(10.0, 100.0)
    end
  end
end