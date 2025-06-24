class PriceGenerator
  def self.generate(category_name)
    case category_name.downcase
    when 'lamb'
      rand(45.0..100.0).round(2)
    when 'beef'
      rand(35.0..80.0).round(2)
    when 'pork'
      rand(25.0..60.0).round(2)
    else
      rand(10.0..100.0).round(2)
    end
  end
end