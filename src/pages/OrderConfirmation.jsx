import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ShoppingBag, 
  Truck, 
  Mail, 
  Home, 
  ArrowLeft,
  Clock
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // In a real app, you would fetch the order details using an order ID from the URL
  // For now, we'll simulate a successful order
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrder({
        id: `#${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString(),
        items: JSON.parse(localStorage.getItem('lastOrderItems') || '[]'),
        total: parseFloat(localStorage.getItem('lastOrderTotal') || '0'),
        shippingAddress: JSON.parse(localStorage.getItem('shippingAddress') || '{}')
      });
      setLoading(false);
      
      // Clear the last order from localStorage
      localStorage.removeItem('lastOrderItems');
      localStorage.removeItem('lastOrderTotal');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-blue-200 rounded-full mx-auto"></div>
            <div className="mt-4 h-6 w-64 bg-gray-200 rounded mx-auto"></div>
            <div className="mt-4 h-4 w-96 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find your order details. Please check your order history or contact support.</p>
            <Link
              to="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Order History
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your purchase, {order.shippingAddress.name?.split(' ')[0] || 'Valued Customer'}!
            </p>
            <p className="text-gray-500 mt-1">
              Order #{order.id} • {order.date}
            </p>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Summary
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Order details and shipping information
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Order number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.id}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date placed</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.date}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                    ${order.total.toFixed(2)}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Shipping address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <address className="not-italic">
                      {order.shippingAddress.name && <div>{order.shippingAddress.name}</div>}
                      {order.shippingAddress.street && <div>{order.shippingAddress.street}</div>}
                      {order.shippingAddress.city && order.shippingAddress.state && order.shippingAddress.zipCode && (
                        <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                      )}
                      {order.shippingAddress.country && <div>{order.shippingAddress.country}</div>}
                      {order.shippingAddress.phone && <div className="mt-1">Phone: {order.shippingAddress.phone}</div>}
                    </address>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Processing
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Items
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-md object-cover"
                          src={item.image || 'https://via.placeholder.com/80'}
                          alt={item.name}
                        />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              
              <li className="px-4 py-4 sm:px-6 border-t border-gray-200">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Includes ${(order.total * 0.08).toFixed(2)} in taxes and $15.00 in shipping
                </p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                What's Next?
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Order Confirmation</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      We've sent a confirmation email to {order.shippingAddress.email || 'your email address'} with your order details.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Shipping Updates</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      We'll send you shipping updates as your order is processed and shipped.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Delivery Time</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Your order will be delivered within 3-5 business days.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              Need help? <a href="/contact" className="text-blue-600 hover:text-blue-500">Contact our support team</a>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home className="-ml-1 mr-2 h-4 w-4" />
                Back to Home
              </Link>
              
              <Link
                to="/orders"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ShoppingBag className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
