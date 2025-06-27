module Api
  module V1
    class ReviewsController < ApiController
      before_action :authenticate_user!, except: [:index, :show]
      before_action :set_reviewable, only: [:index, :create]
      before_action :set_review, only: [:show, :update, :destroy]
      before_action :authorize_user!, only: [:update, :destroy]
      
      # GET /api/v1/meals/:meal_id/reviews
      def index
        @reviews = @reviewable.reviews.includes(:user).order(created_at: :desc)
        
        # Add user email to each review
        reviews_with_email = @reviews.map do |review|
          review_data = review.as_json
          review_data['user_email'] = review.user&.email
          review_data
        end
        
        render json: reviews_with_email
      end
      
      # GET /api/v1/reviews/:id
      def show
        render json: @review
      end
      
      # POST /api/v1/meals/:meal_id/reviews
      def create
        @review = @reviewable.reviews.new(review_params)
        @review.user = current_user
        
        if @review.save
          render json: @review , status: :created
        else
          render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # PATCH/PUT /api/v1/reviews/:id
      def update
        if @review.user == current_user && @review.update(review_params)
          render json: @review
        else
          render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # DELETE /api/v1/reviews/:id
      def destroy
        if @review.user == current_user
          @review.destroy
          head :no_content
        else
          render json: { error: "You are not authorized to delete this review" }, status: :unauthorized
        end
      end
      
      private
      
      def set_reviewable
        if params[:meal_id]
          @reviewable = Meal.find(params[:meal_id])
        elsif params[:category_id]
          @reviewable = Category.find(params[:category_id])
        end
      end
      
      def set_review
        @review = Review.find(params[:id])
      end
      
      def review_params
        params.require(:review).permit(:title, :rating, :content)
      end
      
      def authorize_user!
        unless @review.user == current_user || current_user.admin?
          render json: { error: "You are not authorized to perform this action" }, status: :forbidden
        end
      end
    end
  end
end