import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, Users, Package, ShoppingCart, DollarSign, Eye, Star, Calendar } from 'lucide-react';
import { getUsers } from '../../store/slices/userSlice';
import { getProducts } from '../../store/slices/productSlice';
import { getOrders } from '../../store/slices/orderSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { products } = useSelector((state) => state.products);
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getProducts({ limit: 100 }));
    dispatch(getOrders());
  }, [dispatch]);

  // Calculate analytics data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalViews = products.reduce((sum, product) => sum + product.views, 0);
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Monthly data (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', revenue: 12400, orders: 45, users: 120 },
    { month: 'Feb', revenue: 15200, orders: 52, users: 145 },
    { month: 'Mar', revenue: 18800, orders: 68, users: 178 },
    { month: 'Apr', revenue: 22100, orders: 75, users: 210 },
    { month: 'May', revenue: 19600, orders: 63, users: 195 },
    { month: 'Jun', revenue: 25800, orders: 89, users: 245 },
  ];

  // Top performing products
  const topProducts = products
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Recent activities
  const recentActivities = [
    { type: 'order', message: 'New order #ORD-001 placed', time: '2 hours ago', icon: ShoppingCart },
    { type: 'user', message: 'New seller registered', time: '4 hours ago', icon: Users },
    { type: 'product', message: 'Product "Diamond Ring" added', time: '6 hours ago', icon: Package },
    { type: 'revenue', message: 'Daily revenue target achieved', time: '8 hours ago', icon: DollarSign },
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your marketplace performance</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+15% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-xs text-blue-600 mt-1">+8% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-xs text-purple-600 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(0)}</p>
                <p className="text-xs text-yellow-600 mt-1">+5% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(data.revenue / 30000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      ${(data.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(data.orders / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {data.orders}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products available</p>
              ) : (
                topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">${product.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{product.sales} sold</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="w-3 h-3 mr-1" />
                        {product.views}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customers</span>
                <span className="font-medium">{users.filter(u => u.role === 'customer').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sellers</span>
                <span className="font-medium">{users.filter(u => u.role === 'seller').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admins</span>
                <span className="font-medium">{users.filter(u => u.role === 'admin').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-orange-600">
                  {orders.filter(o => o.orderStatus === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Processing</span>
                <span className="font-medium text-blue-600">
                  {orders.filter(o => o.orderStatus === 'processing').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">
                  {orders.filter(o => o.orderStatus === 'delivered').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Products</span>
                <span className="font-medium text-green-600">
                  {products.filter(p => p.isActive).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="font-medium text-green-600">
                  {users.filter(u => u.isActive).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;