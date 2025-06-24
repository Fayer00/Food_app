Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :categories, only: [:index]
      resources :meals, only: [:index]
      namespace :payments do
        post 'create_payment_intent'
      end
      get 'convert_currency', to: 'meals#convert_currency'
    end
  end

  get 'completion', to: 'static#index'
end