import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Us
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Learn more about our story and what makes us different.
          </p>
        </div>

        <div className="mt-20">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  Founded in 2023, our e-commerce platform was born out of a simple idea: to create a seamless shopping experience that connects buyers with quality products from trusted sellers. What started as a small team of passionate individuals has grown into a thriving marketplace serving thousands of customers worldwide.
                </p>
                <p className="text-gray-600 mb-4">
                  We believe in the power of technology to transform the way people shop and sell. Our platform is designed to be intuitive, secure, and accessible to everyone, whether you're a first-time buyer or an experienced seller.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Our Mission</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  Our mission is to empower businesses of all sizes to reach their full potential in the digital marketplace while providing customers with an exceptional shopping experience. We're committed to innovation, quality, and customer satisfaction in everything we do.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Why Choose Us?</h2>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-indigo-600 text-3xl mb-4">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Shopping</h3>
                  <p className="text-gray-600">Your security is our top priority with industry-standard encryption.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-indigo-600 text-3xl mb-4">
                    <i className="fas fa-truck"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">Quick and reliable shipping to your doorstep.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-indigo-600 text-3xl mb-4">
                    <i className="fas fa-headset"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">24/7 Support</h3>
                  <p className="text-gray-600">Our customer service team is always here to help.</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
