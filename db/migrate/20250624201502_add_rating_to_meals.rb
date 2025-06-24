class AddRatingToMeals < ActiveRecord::Migration[7.0]
  def change
    add_column :meals, :rating, :decimal, precision: 2, scale: 1, null: false, default: 3.0
  end
end
