import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { getCategories } from '../store/slices/categorySlice';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Jewelry Categories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our diverse collection of jewelry categories, each offering unique pieces 
            crafted with precision and elegance.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {categories.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories available</h3>
                <p className="text-gray-600">Categories will be displayed here once they are added.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/products?category=${category._id}`}
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-6xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                          💎
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {category.description || 'Discover beautiful jewelry pieces in this category.'}
                      </p>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                        <span>Explore Collection</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Featured Categories Section */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Categories?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Each category is carefully curated to offer you the finest selection of jewelry pieces.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">✨</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
                  <p className="text-gray-600">
                    Every piece in our categories meets the highest standards of craftsmanship and quality.
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">🎨</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Diverse Designs</h3>
                  <p className="text-gray-600">
                    From classic to contemporary, our categories offer designs for every taste and occasion.
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">🔍</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Discovery</h3>
                  <p className="text-gray-600">
                    Our organized categories make it easy to find exactly what you're looking for.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-xl mb-8 opacity-90">
                Browse our complete collection or contact our experts for personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  View All Products
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Categories;