ActiveAdmin.register Review do
  # Permit all parameters for creating and updating reviews
  permit_params :title, :rating, :content, :user_id, :reviewable_id, :reviewable_type

  # Index page configuration
  index do
    selectable_column
    id_column
    column :title
    column :rating do |review|
      "#{review.rating}/5"
    end
    column :user
    column :reviewable_type
    column :reviewable do |review|
      if review.reviewable.respond_to?(:name)
        link_to review.reviewable.name, polymorphic_path([:admin, review.reviewable])
      else
        "#{review.reviewable_type} ##{review.reviewable_id}"
      end
    end
    column :created_at
    actions
  end

  # Filters for the index page
  filter :title
  filter :rating
  filter :user
  filter :reviewable_type
  filter :created_at

  # Show page configuration
  show do
    attributes_table do
      row :id
      row :title
      row :rating do |review|
        "#{review.rating}/5"
      end
      row :user
      row :reviewable_type
      row :reviewable do |review|
        if review.reviewable.respond_to?(:name)
          link_to review.reviewable.name, polymorphic_path([:admin, review.reviewable])
        else
          "#{review.reviewable_type} ##{review.reviewable_id}"
        end
      end
      row :content do |review|
        div class: 'rich-text-content' do
          review.content
        end
      end
      row :created_at
      row :updated_at
    end
  end

  # Form configuration
  form do |f|
    f.inputs do
      f.input :title
      f.input :rating, as: :select, collection: 1..5
      f.input :user
      f.input :reviewable_type, as: :select, collection: ['Meal', 'Category']
      f.input :reviewable_id, label: 'Reviewable ID'
      f.input :content, as: :rich_text_area
    end
    f.actions
  end

  # Custom scopes
  scope :all, default: true
  scope :recent, -> { order(created_at: :desc).limit(10) }
  scope :highest_rated, -> { where(rating: 5) }
  scope :lowest_rated, -> { where(rating: 1) }

  # Custom action to approve a review (example)
  action_item :approve, only: :show do
    link_to 'Approve Review', approve_admin_review_path(review), method: :put if !review.approved
  end

  member_action :approve, method: :put do
    resource.update(approved: true)
    redirect_to admin_review_path(resource), notice: "Review approved!"
  end

  # Batch actions
  batch_action :approve do |ids|
    batch_action_collection.find(ids).each do |review|
      review.update(approved: true)
    end
    redirect_to collection_path, notice: "Reviews approved!"
  end

  # CSV export configuration
  csv do
    column :id
    column :title
    column :rating
    column(:user) { |review| review.user.email }
    column :reviewable_type
    column(:reviewable) { |review| review.reviewable.try(:name) || review.reviewable_id }
    column :created_at
  end

  # Customize the controller
  controller do
    def scoped_collection
      super.includes(:user, :reviewable) # Eager load associations for better performance
    end
  end
end