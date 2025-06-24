module Api
  module V1
    class MealsController < ApiController
      def index
        @meals = Meal.includes(:category).all

        # Search
        @meals = @meals.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?

        # Filter by category
        @meals = @meals.where(category_id: params[:category_id]) if params[:category_id].present?

        # Sorting
        if params[:sort_by].present?
          direction = params[:sort_dir] == 'desc' ? 'DESC' : 'ASC'
          case params[:sort_by]
          when 'price'
            @meals = @meals.order(price: direction)
          when 'name'
            @meals = @meals.order(name: direction)
            # Add the case for sorting by rating.
          when 'rating'
            @meals = @meals.order(rating: direction)
          end
        end

        render json: @meals, include: :category
      end

      def convert_currency
        to_currency = params[:to_currency].upcase
        @meals = Meal.all
        converted_meals = @meals.map do |meal|
          converted_price = CurrencyService.convert(meal.price, to_currency)
          meal.attributes.merge(price: converted_price, currency: to_currency)
        end
        render json: converted_meals
      end
    end
  end
end