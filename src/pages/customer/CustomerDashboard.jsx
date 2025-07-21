import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Heart, Star, Eye, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getUserOrders } from '../../store/slices/orderSlice';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    dispatch(getUserOrders({ limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      setRecentOrders(orders.slice(0, 5));
    }
  }, [orders]);

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.orderStatus === 'delivered').length;
  const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;

  const statsCards = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      subtitle: `${pendingOrders} pending`,
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: Package,
      color: 'bg-green-500',
      subtitle: 'Successfully delivered',
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toLocaleString()}`,
      icon: Star,
      color: 'bg-purple-500',
      subtitle: 'Lifetime purchases',
    },
    {
      title: 'Member Since',
      value: new Date(user?.createdAt).getFullYear(),
      icon: Calendar,
      color: 'bg-yellow-500',
      subtitle: 'Years of membership',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Here's what's happening with your orders</p>
          </div>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Browse Products</h3>
                <p className="text-gray-600">Discover new jewelry pieces</p>
              </div>
            </div>
          </Link>

          <Link
            to="/customer/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
                <p className="text-gray-600">Track your purchases</p>
              </div>
            </div>
          </Link>

          <Link
            to="/customer/wishlist"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
                <p className="text-gray-600">Saved items for later</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link
              to="/customer/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Start shopping now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total}</p>
                      <p className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'pending' ? 'bg-orange-100 text-orange-600' :
                        order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-600' :
                        order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                        <div className="text-xs">💎</div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-sm text-gray-600">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <Link
                      to={`/customer/orders/${order._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;