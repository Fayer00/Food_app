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

  root 'home#index'
  get "completion", to: "home#index"

  namespace :api do
    namespace :v1 do
      delete 'logout', to: 'sessions#destroy'
      resources :wishlist_items, only: [:index, :create, :destroy]

      resources :categories, only: [:index]
      resources :meals, only: [:index]
      get "convert_currency", to: "meals#convert_currency"
      namespace :payments do
        post "create_payment_intent"
      end
    end
  end

  get '*path', to: 'home#index', via: :all
end