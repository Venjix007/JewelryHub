import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'https://jewelry-ewqbvhyub-abhays-projects-5c930c24.vercel.app',
  'https://jewelry-hub.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || 
        process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS with the above options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// Static files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes - Support both /api/ and non-prefixed routes
const apiRoutes = [
  { path: '/auth', router: authRoutes },
  { path: '/users', router: userRoutes },
  { path: '/products', router: productRoutes },
  { path: '/categories', router: categoryRoutes },
  { path: '/orders', router: orderRoutes }
];

// Apply routes with and without /api prefix
apiRoutes.forEach(route => {
  app.use(`/api${route.path}`, route.router);
  app.use(route.path, route.router);
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Jewelry Hub API',
    documentation: 'Please use the /api/ endpoints to interact with the API',
    healthCheck: '/api/health',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check endpoint with database status
app.get('/api/health', async (req, res) => {
  const dbStatus = {
    state: mongoose.connection.readyState,
    stateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    dbName: mongoose.connection.db?.databaseName,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    models: Object.keys(mongoose.connection.models)
  };

  const isDbConnected = mongoose.connection.readyState === 1;
  const status = isDbConnected ? 200 : 503;
  const health = {
    status: isDbConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    memoryUsage: process.memoryUsage()
  };

  res.status(status).json(health);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// MongoDB connection with enhanced error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Log database events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});