import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ShoppingCart, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  CheckCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Info
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  selectCartItems, 
  selectCartTotal, 
  clearCart 
} from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit-card',
    saveInfo: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState('shipping');
  
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep === 'shipping') {
      setActiveStep('payment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email
        },
        paymentMethod: formData.paymentMethod
      };
      
      await dispatch(createOrder(orderData)).unwrap();
      
      // Clear cart on successful order
      dispatch(clearCart());
      
      // Navigate to order confirmation
      navigate('/order-confirmation');
      
    } catch (error) {
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderShippingStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State/Province *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            ZIP/Postal Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            required
            value={formData.zipCode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <select
          id="country"
          name="country"
          required
          value={formData.country}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option>United States</option>
          <option>Canada</option>
          <option>United Kingdom</option>
          <option>Australia</option>
          <option>Other</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          id="saveInfo"
          name="saveInfo"
          type="checkbox"
          checked={formData.saveInfo}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
          Save this information for next time
        </label>
      </div>
    </div>
  );
  
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="credit-card"
            name="paymentMethod"
            type="radio"
            value="credit-card"
            checked={formData.paymentMethod === 'credit-card'}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Credit Card
            </div>
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="paypal"
            name="paymentMethod"
            type="radio"
            value="paypal"
            checked={formData.paymentMethod === 'paypal'}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-5 mr-2" />
              PayPal
            </div>
          </label>
        </div>
      </div>
      
      {formData.paymentMethod === 'credit-card' && (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number *
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date *
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">
              Name on Card *
            </label>
            <input
              type="text"
              id="nameOnCard"
              name="nameOnCard"
              placeholder="John Smith"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div className="flex items-center">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <p>Shipping</p>
              <p>${shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <p>Tax</p>
              <p>${tax.toFixed(2)}</p>
            </div>
            <div className="mt-2 flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 mb-8">
            <Link 
              to="/cart" 
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${activeStep === 'shipping' ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${activeStep === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <Truck className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Shipping</p>
                </div>
              </div>
              
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-1 ${activeStep === 'payment' ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: '100%' }}></div>
              </div>
              
              <div className={`flex items-center ${activeStep === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${activeStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Payment</p>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
            {activeStep === 'shipping' ? renderShippingStep() : renderPaymentStep()}
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => activeStep === 'payment' ? setActiveStep('shipping') : navigate('/cart')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              
              {activeStep === 'shipping' && (
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue to Payment
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Secure Checkout</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is encrypted and secure. We don't store your credit card details.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
