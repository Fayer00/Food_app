Rails.application.routes.draw do
  # The root of the site is served by HomeController#index,
  # which loads your React application.
  root "home#index"

  # The completion URL for Stripe payments is also served by HomeController#index.
  # Stripe will redirect here after a payment.
  get "completion", to: "home#index"

  # Define the API routes under the /api/v1 namespace.
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

  # This is a catch-all route. It ensures that if a user refreshes the page
  # on a client-side route, the Rails app still serves the main index page,
  # allowing React Router to take over.
  get '*path', to: 'home#index', via: :all
end