import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authClient } from '../api';
import ReviewList from './ReviewList';

const MealDetail = ({ currentUser }) => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        // Make sure you're not prepending '/api/v1/' here if it's already in the baseURL
        const response = await authClient.get(`/meals/${id}`);
        setMeal(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching meal:', err);
        setError('Failed to load meal details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading meal details...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  if (!meal) {
    return <div className="text-center py-8">Meal not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to="/"
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Catalog
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {meal.image_url && (
          <img 
            src={meal.image_url} 
            alt={meal.name} 
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{meal.name}</h1>
          <p className="text-gray-600 mb-4">{meal.category?.name}</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{meal.average_rating || 'No ratings yet'}</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-4">${meal.price}</p>
          <div className="prose max-w-none mb-8">
            <p>{meal.description}</p>
          </div>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <ReviewList 
        itemType="meal" 
        itemId={id} 
        currentUser={currentUser} 
      />
    </div>
  );
};

export default MealDetail;