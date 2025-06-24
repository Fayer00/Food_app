puts "Seeding database..."

categories_data = MealdbService.fetch_categories

if categories_data.nil?
  puts "Could not fetch categories from TheMealDB API."
  return
end

categories_data.each do |cat_data|
  category = Category.find_or_create_by!(name: cat_data["strCategory"]) do |c|
    c.image_url = cat_data["strCategoryThumb"]
    c.description = cat_data["strCategoryDescription"]
  end
  puts "Seeding meals for #{category.name}..."

  meals_data = MealdbService.fetch_meals_by_category(category.name)
  next if meals_data.nil?

  meals_data.each do |meal_data|
    Meal.find_or_create_by!(api_id: meal_data["idMeal"]) do |meal|
      meal.name = meal_data["strMeal"]
      meal.image_url = meal_data["strMealThumb"]
      meal.category = category
      meal.price = PriceGenerator.generate(category.name)

      meal.rating = rand(1.0..5.0).round(1)
    end
  end
end

puts "Seeding complete."