import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Plus,
  Edit,
  BarChart3,
  Tag,
  Star,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = {
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: Package, label: 'Products', path: '/admin/products' },
      { icon: Tag, label: 'Categories', path: '/admin/categories' },
      { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ],
    seller: [
      { icon: Home, label: 'Dashboard', path: '/seller/dashboard' },
      { icon: Package, label: 'My Products', path: '/seller/products' },
      { icon: Plus, label: 'Add Product', path: '/seller/add-product' },
      { icon: ShoppingCart, label: 'Orders', path: '/seller/orders' },
      { icon: BarChart3, label: 'Analytics', path: '/seller/analytics' },
      { icon: Star, label: 'Reviews', path: '/seller/reviews' },
      { icon: Settings, label: 'Settings', path: '/seller/settings' },
    ],
    customer: [
      { icon: Home, label: 'Dashboard', path: '/customer/dashboard' },
      { icon: ShoppingCart, label: 'My Orders', path: '/customer/orders' },
      { icon: Star, label: 'Reviews', path: '/customer/reviews' },
      { icon: Settings, label: 'Settings', path: '/customer/settings' },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold capitalize">{user?.role} Panel</h2>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;