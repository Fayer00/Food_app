module Api
  module V1
    class WishlistItemsController < ApiController
      before_action :authenticate_user!

      # GET /api/v1/wishlist_items
      def index
        @wishlist_items = current_user.wishlist_items.includes(:wishlistable)
        render json: @wishlist_items, include: :wishlistable
      end

      # POST /api/v1/wishlist_items
      def create
        @wishlist_item = current_user.wishlist_items.new(wishlist_item_params)

        if @wishlist_item.save
          render json: @wishlist_item, status: :created
        else
          render json: @wishlist_item.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/wishlist_items/:id
      def destroy
        @wishlist_item = current_user.wishlist_items.find(params[:id])
        @wishlist_item.destroy
        head :no_content
      end

      private

      def wishlist_item_params
        params.require(:wishlist_item).permit(:wishlistable_id, :wishlistable_type)
      end
    end
  end
end