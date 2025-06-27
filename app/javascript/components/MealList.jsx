import React from 'react';
import { Link } from 'react-router-dom';

const StarIcon = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.05 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
    </svg>
);

const MealCard = ({ meal, onAddToCart, currencySymbol, onAddToWishlist, onRemoveFromWishlist, isWishlisted }) => {
    const rating = parseFloat(meal.rating);
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col relative">
            <button onClick={() => isWishlisted ? onRemoveFromWishlist(meal) : onAddToWishlist(meal)} className="absolute top-2 right-2 bg-white rounded-full p-2 z-10">
                <svg className={`w-6 h-6 ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
            </button>
            <Link to={`/meals/${meal.id}`} className="block">
                <img src={meal.image_url} alt={meal.name} className="w-full h-48 object-cover" />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/meals/${meal.id}`} className="block">
                    <h3 className="text-xl font-semibold mb-2 flex-grow hover:text-blue-500">{meal.name}</h3>
                </Link>
                <p className="text-gray-600 mb-2">{meal.category?.name}</p>
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(rating)} />)}
                    <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{currencySymbol}{parseFloat(meal.price).toFixed(2)}</span>
                    <div className="flex space-x-2">
                        <button onClick={() => isWishlisted ? onRemoveFromWishlist(meal) : onAddToWishlist(meal)} className="text-gray-500 hover:text-red-500">
                            <svg className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button onClick={() => onAddToCart(meal)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function MealList({ 
    meals, 
    wishlist, 
    onAddToCart, 
    onAddToWishlist, 
    onRemoveFromWishlist,
    currency,
    currencySymbol
}) {
    const isInWishlist = (mealId) => {
        return wishlist.some(item => item.wishlistable_id === mealId && item.wishlistable_type === 'Meal');
    };

    if (!meals || meals.length === 0) {
        return <p className="text-center text-gray-500">No meals found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {meals.map(meal => (
                <MealCard
                    key={meal.id}
                    meal={meal}
                    onAddToCart={onAddToCart}
                    currencySymbol={currencySymbol}
                    onAddToWishlist={onAddToWishlist}
                    onRemoveFromWishlist={onRemoveFromWishlist}
                    isWishlisted={isInWishlist(meal.id)}
                />
            ))}
        </div>
    );
};