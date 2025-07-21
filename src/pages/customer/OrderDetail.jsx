import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Calendar, 
  Tag, 
  Info,
  Clock,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import { getOrderById } from '../../store/slices/orderSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderDetail = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, isLoading } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <X className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getNextStep = (currentStatus) => {
    const steps = [
      { status: 'pending', label: 'Order Placed', description: 'We\'ve received your order' },
      { status: 'confirmed', label: 'Order Confirmed', description: 'Your order is confirmed' },
      { status: 'processing', label: 'Processing', description: 'Preparing your order' },
      { status: 'shipped', label: 'Shipped', description: 'On the way to you' },
      { status: 'delivered', label: 'Delivered', description: 'Order delivered' },
    ];
    
    const currentIndex = steps.findIndex(step => step.status === currentStatus);
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  };

  if (isLoading || !order) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  const nextStep = getNextStep(order.orderStatus);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link 
          to="/orders" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span className="ml-2 capitalize">{order.orderStatus}</span>
            </span>
          </div>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.orderStatus === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {order.orderStatus === 'pending' ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <span className="text-xs mt-1 text-center">Order Placed</span>
              </div>
              
              <div className={`flex-1 h-1 ${order.orderStatus !== 'pending' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus) ? <Check className="w-5 h-5" /> : '2'}
                </div>
                <span className="text-xs mt-1 text-center">Confirmed</span>
              </div>
              
              <div className={`flex-1 h-1 ${['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  ['processing', 'shipped', 'delivered'].includes(order.orderStatus) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? <Check className="w-5 h-5" /> : '3'}
                </div>
                <span className="text-xs mt-1 text-center">Processing</span>
              </div>
              
              <div className={`flex-1 h-1 ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  order.orderStatus === 'delivered' 
                    ? 'bg-green-500 text-white' 
                    : order.orderStatus === 'shipped'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {order.orderStatus === 'delivered' ? (
                    <Check className="w-5 h-5" />
                  ) : order.orderStatus === 'shipped' ? (
                    <Truck className="w-5 h-5" />
                  ) : (
                    '4'
                  )}
                </div>
                <span className="text-xs mt-1 text-center">
                  {order.orderStatus === 'delivered' ? 'Delivered' : 'Shipped'}
                </span>
              </div>
            </div>
            
            {nextStep && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-900">Next: {nextStep.label}</h3>
                    <p className="text-sm text-blue-700">{nextStep.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('items')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'items'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Order Items ({order.items.length})
                </button>
                {order.trackingNumber && (
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'tracking'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Tracking
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {activeTab === 'items' ? (
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                              <div className="text-4xl text-blue-600">💎</div>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.product?.name || 'Product'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                        {order.orderStatus === 'delivered' && (
                          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Write a Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Tracking Information</h3>
                        <p className="text-sm text-gray-500">Track your order</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        In Transit
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div className="w-0.5 h-12 bg-gray-200 mt-1"></div>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-medium text-gray-900">Order Processed</p>
                          <p className="text-sm text-gray-500">Your order has been processed</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div className="w-0.5 h-12 bg-gray-200 mt-1"></div>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                          <p className="text-sm text-gray-500">Your order is on the way</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-medium text-gray-900">Out for Delivery</p>
                          <p className="text-sm text-gray-500">Your order is out for delivery</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tracking Number</h4>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="font-mono">{order.trackingNumber}</span>
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Track Package
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({order.items.length} items)</span>
                  <span className="font-medium">${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${order.shippingFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p className="text-gray-600">{order.shippingAddress?.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress?.country}</p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Phone:</span> {order.shippingAddress?.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {order.shippingAddress?.email}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center mr-3">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">
                    {order.paymentMethod === 'credit-card' 
                      ? 'Credit Card ending in ' + (order.paymentDetails?.last4 || '****') 
                      : order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.paymentStatus || 'Paid on ' + new Date(order.paidAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between text-blue-600 hover:text-blue-800">
                  <span>Contact Customer Support</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between text-blue-600 hover:text-blue-800">
                  <span>Return & Refund Policy</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between text-blue-600 hover:text-blue-800">
                  <span>Shipping Information</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetail;
