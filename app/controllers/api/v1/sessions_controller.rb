module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :verify_authenticity_token
      respond_to :json

      def destroy
        if current_user
          sign_out current_user
          render json: { message: "Logged out successfully" }, status: :ok
        else
          render json: { message: "No active session" }, status: :ok
        end
      end
    end
  end
end