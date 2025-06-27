import React from 'react';

const Review = ({ review, currentUser, onEdit, onDelete }) => {
  // Simple date formatting
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return '';
    }
  };
  
  // Check if the current user is the author of this review
  const isAuthor = currentUser && currentUser.id === review.user_id;
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Safely get user email
  const userEmail = review.user_email || (review.user && review.user.email) || "Anonymous";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{review.title || "No Title"}</h3>
        <div className="flex space-x-2">
          {isAuthor && (
            <>
              <button 
                onClick={() => onEdit && onEdit(review)} 
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete && onDelete(review.id)} 
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center mb-2">
        {renderStars(review.rating || 0)}
      </div>
      
      <p className="text-gray-700 mb-4">{review.content || "No content"}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          By {userEmail}
        </div>
        <div>{formatDate(review.created_at)}</div>
      </div>
    </div>
  );
};

export default Review;