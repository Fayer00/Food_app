import React from 'react';

// Star icon component
const StarIcon = ({ filled }) => (
    <svg
        className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.05 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
    </svg>
);


const MealCard = ({ meal, onAddToCart, currencySymbol }) => {
    const rating = parseFloat(meal.rating);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
            <img src={meal.image_url} alt={meal.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 flex-grow">{meal.name}</h3>

                {/* Display the rating stars */}
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} filled={i < Math.round(rating)} />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
                </div>

                <p className="text-gray-800 font-bold text-lg mb-4">{currencySymbol}{parseFloat(meal.price).toFixed(2)}</p>
                <button
                    onClick={() => onAddToCart(meal)}
                    className="w-full mt-auto bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};


export default function MealList({ meals, onAddToCart, currency, currencySymbol }) {
    if (!meals || meals.length === 0) {
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