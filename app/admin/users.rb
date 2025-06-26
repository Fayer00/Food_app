ActiveAdmin.register User do
  menu priority: 2  # This sets the position in the menu

  # Define which columns to show in the index view
  index do
    selectable_column
    id_column
    column :email
    column :created_at
    column :updated_at
    actions
  end

  # Define filters for the sidebar
  filter :email
  filter :created_at

  # Define the form for creating/editing users
  form do |f|
    f.inputs "User Details" do
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end

  # Define which parameters are permitted when creating/updating a user
  permit_params :email, :password, :password_confirmation

  # Add ransackable attributes for Ransack compatibility
  controller do
    def find_resource
      User.find(params[:id])
    end
  end
end