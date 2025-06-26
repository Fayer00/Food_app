class CreateWishlistItems < ActiveRecord::Migration[7.0]
  def change
    create_table :wishlist_items do |t|
      t.references :user, null: false, foreign_key: true
      # This creates the polymorphic columns: wishlistable_id and wishlistable_type
      t.references :wishlistable, polymorphic: true, null: false
      t.timestamps
    end
  end
end