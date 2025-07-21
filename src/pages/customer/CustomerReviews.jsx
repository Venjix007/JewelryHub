import React, { useState } from 'react';
import { Star, Search, Filter, Edit, Trash2, Plus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const CustomerReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Mock reviews data - in a real app, this would come from Redux store
  const [reviews] = useState([
    {
      id: '1',
      productName: 'Diamond Engagement Ring',
      productImage: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg',
      rating: 5,
      comment: 'Absolutely stunning ring! The quality is exceptional and it arrived exactly as described. My fiancée loves it!',
      date: '2024-02-15',
      seller: 'Luxury Jewels',
      helpful: 12,
    },
    {
      id: '2',
      productName: 'Gold Necklace',
      productImage: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
      rating: 4,
      comment: 'Beautiful necklace with great craftsmanship. The gold quality is excellent. Only minor issue was the clasp being a bit stiff.',
      date: '2024-02-10',
      seller: 'Golden Touch',
      helpful: 8,
    },
    {
      id: '3',
      productName: 'Pearl Earrings',
      productImage: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
      rating: 5,
      comment: 'These earrings are perfect! The pearls have a beautiful luster and they\'re very comfortable to wear.',
      date: '2024-02-05',
      seller: 'Pearl Paradise',
      helpful: 15,
    },
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
      />
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
            <p className="text-gray-600">Manage your product reviews and ratings</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Write Review</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <div className="text-blue-600">📝</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Helpful Votes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.reduce((sum, review) => sum + review.helpful, 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <div className="text-green-600">👍</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.rating === 5).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <div className="text-purple-600">⭐</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-16 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {reviews.length === 0 
                  ? 'Start reviewing products you\'ve purchased to help other customers'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {reviews.length === 0 && (
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Products to Review
                </button>
              )}
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{review.productName}</h3>
                        <p className="text-sm text-gray-600">by {review.seller}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700 p-1 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {review.helpful} people found this helpful
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Edit Review
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm">
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Reviews</h3>
          <p className="text-gray-600 mb-4">You have products waiting for your review</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-blue-600">💎</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Silver Bracelet</p>
                  <p className="text-sm text-gray-600">Delivered 3 days ago</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Write Review
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-blue-600">💎</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ruby Ring</p>
                  <p className="text-sm text-gray-600">Delivered 1 week ago</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Write Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerReviews;