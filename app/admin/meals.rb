ActiveAdmin.register Meal do
  filter :name
  filter :category
  filter :price
  filter :rating
  filter :created_at
  filter :updated_at

  index do
    selectable_column
    id_column
    column :name
    column :category
    column :price
    column :rating
    column :created_at
    actions
  end

  filter :category
  filter :name
  filter :price
  filter :rating

  form do |f|
    f.inputs do
      f.input :category
      f.input :name
      f.input :api_id, label: "TheMealDB ID"
      f.input :image_url
      f.input :price
      f.input :rating
    end
    f.actions
  end
end