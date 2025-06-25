ActiveAdmin.register Category do
  filter :name
  filter :description
  filter :created_at
  filter :updated_at
  filter :meals_id, as: :select, collection: proc { Meal.all.map { |m| [m.name, m.id] } }

  index do
    selectable_column
    id_column
    column :name
    column :created_at
    actions
  end

  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :image_url
    end
    f.actions
  end
end