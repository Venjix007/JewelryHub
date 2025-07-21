import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, clearReviewError, resetReviewState } from '../../store/slices/reviewSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const ReviewForm = ({ productId, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.reviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);

  useEffect(() => {
    return () => {
      dispatch(resetReviewState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setComment('');
      setRating(5);
      if (onSuccess) onSuccess();
    }
  }, [success, onSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return;
    }
    
    dispatch(createReview({
      productId,
      reviewData: { rating, comment: comment.trim() }
    }));
  };

  const handleErrorDismiss = () => {
    dispatch(clearReviewError());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
          <div className="flex justify-between items-center">
            <p>{error}</p>
            <button 
              onClick={handleErrorDismiss}
              className="text-red-700 hover:text-red-900"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>Thank you for your review!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  key={ratingValue}
                  type="button"
                  className="p-1 focus:outline-none"
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hover || rating) >= ratingValue
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !comment.trim()}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading || !comment.trim()
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors flex items-center`}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={4} className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
