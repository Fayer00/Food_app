Rails.application.routes.draw do
  devise_for :users,
             path: '',
             path_names: {
               sign_in: 'login',
               sign_out: 'logout',
               registration: 'signup'
             },
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations'
             }

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # API routes
  namespace :api do
    namespace :v1 do
      delete 'logout', to: 'sessions#destroy'
      resources :wishlist_items, only: [:index, :create, :destroy]

      resources :categories, only: [:index] do
        resources :reviews, only: [:index, :create]
      end

      resources :meals, only: [:index, :show] do
        resources :reviews, only: [:index, :create]
      end

      get "convert_currency", to: "meals#convert_currency"
      namespace :payments do
        post "create_payment_intent"
      end

      resources :reviews, only: [:show, :update, :destroy]
      # Other API routes...
    end
  end

  # Root route
  root 'application#index'

  # Catch-all route for React Router
  get '*path', to: 'application#index', constraints: ->(request) do
    !request.xhr? && request.format.html? && !request.path.start_with?('/admin', '/api')
  end
end