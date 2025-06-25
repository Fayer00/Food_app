Rails.application.routes.draw do
  # Devise and ActiveAdmin routes should come first.
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # API routes are next, so they are matched before the catch-all.
  namespace :api do
    namespace :v1 do
      resources :categories, only: [:index]
      resources :meals, only: [:index]
      get "convert_currency", to: "meals#convert_currency"
      namespace :payments do
        post "create_payment_intent"
      end
    end
  end

  # Application-specific frontend routes.
  root 'home#index'
  get "completion", to: "home#index"

  # The catch-all route must be last.
  # It sends any other path to your React app to handle client-side routing.
  get '*path', to: 'home#index', via: :all
end