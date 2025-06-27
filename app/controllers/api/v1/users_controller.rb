module Api
  module V1
    class UsersController < ApiController
      before_action :set_user, only: [:show]
      
      # GET /api/v1/users/:id
      def show
        render json: { id: @user.id, email: @user.email }
      end
      
      private
      
      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end
    end
  end
end