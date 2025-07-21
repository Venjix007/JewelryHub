import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, Heart, Share2, Eye, Package, Shield, Truck, MessageCircle } from 'lucide-react';
import { getProduct } from '../store/slices/productSlice';
import { addItem } from '../store/slices/cartSlice';
import { getProductReviews, createReview } from '../store/slices/reviewSlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReviewForm from '../components/reviews/ReviewForm';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, isLoading } = useSelector((state) => state.products);
  const { reviews: productReviews = [], isLoading: isReviewsLoading, error: reviewsError } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);
  
  // Filter out any invalid reviews that might be missing required fields
  const validReviews = Array.isArray(productReviews) 
    ? productReviews.filter(review => review && (review.user || review.rating || review.comment))
    : [];
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
      dispatch(getProductReviews(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      seller: product.seller?.name || 'Unknown Seller',
      quantity: quantity
    }));
    toast.success('Product added to cart!');
  };

  const handleAddToWishlist = () => {
    toast.success('Product added to wishlist!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/products" className="text-primary hover:text-primary/80 transition-colors">
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 transition-colors">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 transition-colors">
                  <div className="text-8xl text-blue-600 dark:text-blue-400">💎</div>
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-md overflow-hidden transition-all ${selectedImage === index ? 'ring-2 ring-primary' : 'ring-1 ring-border opacity-80 hover:opacity-100'}`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 ${rating < Math.floor(product.averageRating || 0) ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                      fill={rating < Math.floor(product.averageRating || 0) ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.reviewCount || 0} reviews
                  </span>
                </div>
                <span className="text-muted-foreground/50">|</span>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-destructive'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <p className="text-3xl font-semibold text-foreground">
                ${product.price.toFixed(2)}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      value && (
                        <div key={key}>
                          <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}:</span>
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Seller Information</h3>
                <p className="text-gray-700 dark:text-gray-300">{product.seller?.storeName || product.seller?.name}</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">4.8 seller rating</span>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex items-center border border-input rounded-md">
                  <button
                    type="button"
                    className="px-4 py-2 text-foreground hover:bg-accent transition-colors"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-foreground">{quantity}</span>
                  <button
                    type="button"
                    className="px-4 py-2 text-foreground hover:bg-accent transition-colors"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-6 w-6" />
                </button>
                <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-b border-border py-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Free shipping on all orders over $50
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">
                    2-Year Warranty
                  </span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Free returns within 30 days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Customer Reviews</h2>
          
          <div className="mt-12">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                >
                  Reviews ({validReviews.length})
                </button>
              </nav>
            </div>

            <div className="mt-8">
              {activeTab === 'description' ? (
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-lg font-medium text-foreground mb-4">Product Description</h3>
                  <p className="text-muted-foreground">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              ) : (
                <div>
                  {isReviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : validReviews.length > 0 ? (
                    <div className="space-y-8">
                      {validReviews.map((review) => (
                        <div key={review._id} className="border-b border-border pb-8">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                              {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground">
                                {review.user?.name || 'Anonymous'}
                              </h4>
                              <div className="flex items-center mt-1">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <Star
                                    key={rating}
                                    className={`h-4 w-4 ${rating < review.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                                    fill={rating < review.rating ? 'currentColor' : 'none'}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground/70">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;