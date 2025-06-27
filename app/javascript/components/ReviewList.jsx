import React, { useState, useEffect } from 'react';
import Review from './Review';
import ReviewForm from './ReviewForm';
import { authClient } from '../api';

const ReviewList = ({ itemType, itemId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [itemType, itemId]);

  // Check if current user has already reviewed this item
  useEffect(() => {
    if (currentUser && reviews.length > 0) {
      const hasReviewed = reviews.some(review => review.user_id === currentUser.id);
      setUserHasReviewed(hasReviewed);
    }
  }, [currentUser, reviews]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Make sure you're not prepending '/api/v1/' here if it's already in the baseURL
      const response = await authClient.get(`/${itemType}s/${itemId}/reviews`);
      setReviews(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (formData) => {
    try {
      // Make sure you're not prepending '/api/v1/' here if it's already in the baseURL
      const response = await authClient.post(`/${itemType}s/${itemId}/reviews`, {
        review: formData
      });
      
      setReviews([response.data, ...reviews]);
      setShowForm(false);
      setUserHasReviewed(true);
    } catch (err) {
      console.error('Error creating review:', err);
      throw err; // Re-throw to be handled by the form component
    }
  };

  const handleUpdateReview = async (formData) => {
    try {
      // Make sure you're not prepending '/api/v1/' here if it's already in the baseURL
      const response = await authClient.put(`/reviews/${editingReview.id}`, {
        review: formData
      });
      
      setReviews(reviews.map(review => 
        review.id === editingReview.id ? response.data : review
      ));
      setEditingReview(null);
    } catch (err) {
      console.error('Error updating review:', err);
      throw err; // Re-throw to be handled by the form component
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      // Make sure you're not prepending '/api/v1/' here if it's already in the baseURL
      await authClient.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review.id !== reviewId));
      setUserHasReviewed(false);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
        {currentUser && !userHasReviewed && !showForm && !editingReview && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
          <ReviewForm 
            onSubmit={handleCreateReview}
            onCancel={cancelForm}
          />
        </div>
      )}

      {editingReview && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Your Review</h3>
          <ReviewForm 
            review={editingReview}
            onSubmit={handleUpdateReview}
            onCancel={cancelForm}
          />
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
      ) : (
        <div>
          {reviews.map(review => (
            <Review 
              key={review.id} 
              review={review}
              currentUser={currentUser}
              onEdit={handleEditClick}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;