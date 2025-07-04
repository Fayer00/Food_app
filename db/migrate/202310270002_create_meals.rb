class CreateMeals < ActiveRecord::Migration[7.0]
  def change
    create_table :meals do |t|
      t.string :name
      t.string :api_id
      t.string :image_url
      t.decimal :price, precision: 8, scale: 2
      t.references :category, null: false, foreign_key: true
      t.timestamps
    end
  end
end