class AddDescriptionToMeals < ActiveRecord::Migration[7.0]
  def change
    add_column :meals, :description, :text, null: true
  end
end