import React from 'react';

// Meal Card Component
const MealCard = ({ meal, onAddToCart, currencySymbol }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <img src={meal.image_url} alt={meal.name} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
            <p className="text-gray-700 font-bold text-lg mb-4">{currencySymbol}{parseFloat(meal.price).toFixed(2)}</p>
            <button
                onClick={() => onAddToCart(meal)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
                Add to Cart
            </button>
        </div>
    </div>
);

// Meal List Component
export default function MealList({ meals, onAddToCart, currency, currencySymbol }) {
    if (meals.length === 0) {
        return <p className="text-center text-gray-500">No meals found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {meals.map(meal => (
                <MealCard key={meal.id} meal={meal} onAddToCart={onAddToCart} currencySymbol={currencySymbol} />
            ))}
        </div>
    );
}