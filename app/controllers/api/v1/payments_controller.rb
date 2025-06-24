require 'stripe'

module Api
  module V1
    class PaymentsController < ApplicationController
      def create_payment_intent
        Stripe.api_key = ENV['STRIPE_SECRET_KEY']

        begin
          payment_intent = Stripe::PaymentIntent.create(
            amount: params[:amount],
            currency: params[:currency] || 'usd',
            automatic_payment_methods: {
              enabled: true,
            },
            )

          render json: {
            clientSecret: payment_intent.client_secret
          }
        rescue Stripe::StripeError => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
      end
    end
  end
end