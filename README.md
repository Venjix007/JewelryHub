# Jewelry Marketplace - Full Stack Application

A comprehensive full-stack jewelry marketplace application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring role-based authentication and modern UI/UX design.

## Features

### 🔐 Authentication System
- JWT-based authentication
- Role-based access control (Admin, Seller, Customer)
- Secure user registration and login
- Protected routes for different user roles

### 👥 User Roles

#### Admin
- User management (view, activate/deactivate users)
- Product management (view, approve, delete products)
- Category management (create, edit, delete categories)
- Order management and analytics
- Complete dashboard with statistics

#### Seller
- Product management (add, edit, delete own products)
- Order management (view and update order status)
- Sales analytics and statistics
- Store profile management

#### Customer
- Browse and search products
- Product reviews and ratings
- Order history and tracking
- Wishlist functionality
- User profile management

### 🏪 Product Management
- Image upload and management
- Product categorization
- Search and filtering
- Product reviews and ratings
- Inventory management

### 📦 Order Management
- Complete order lifecycle management
- Order status tracking
- Payment integration ready
- Order history and analytics

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean and intuitive interface
- Loading states and error handling
- Toast notifications
- Professional dashboard layouts

## Tech Stack

### Frontend
- **React.js** - Component-based UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Axios** - API communication
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Helmet** - Security
- **CORS** - Cross-origin resource sharing

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jewelry_marketplace
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. In the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Accounts

For testing purposes, you can create these demo accounts:

- **Admin**: admin@jewelryhub.com / password
- **Seller**: seller@jewelryhub.com / password
- **Customer**: customer@jewelryhub.com / password

## Project Structure

```
jewelry-marketplace/
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── services/
│   └── App.jsx
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller)
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/my-orders` - Get user orders (Customer)
- `GET /api/orders/seller/orders` - Get seller orders (Seller)
- `POST /api/orders` - Create order (Customer)
- `PUT /api/orders/:id/status` - Update order status

### Users
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please contact: support@jewelryhub.com

---

Built with ❤️ using the MERN stack