ActiveAdmin.register WishlistItem do
  menu priority: 4

  index do
    selectable_column
    id_column
   
    column :user
    column :wishlistable
    column :created_at
    actions
  end

  filter :wishlistable_type

  form do |f|
    f.inputs do
      f.input :user
      f.input :wishlistable_type, as: :select, collection: ['Meal']
      f.input :wishlistable_id, label: 'Wishlistable ID'
    end
    f.actions
  end

  permit_params :user_id, :wishlistable_type, :wishlistable_id
end