import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Config and database
import { config } from './config/env.js';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';

// Routes and middleware
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { requestLogger, trackActivity } from './middleware/activityLogger.js';
import { socketAuth } from './middleware/socketAuth.js';

// Socket handlers
import { setupMessageSocket } from './sockets/messageSocket.js';
import { setupNotificationSocket } from './sockets/notificationSocket.js';
import { setupTypingSocket } from './sockets/typingSocket.js';
import { setupOnlineUsersSocket } from './sockets/onlineUsersSocket.js';
import { setupContractSocket } from './sockets/contractSocket.js';

// Background jobs
import './jobs/emailQueue.js';
import './jobs/notificationQueue.js';
import './jobs/reportQueue.js';
import './jobs/payoutQueue.js';

// Logger
import logger from './utils/logger.js';

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Allowed origins (support comma-separated list in FRONTEND_URL)
const allowedOrigins = String(config.frontendUrl)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const isDev = config.nodeEnv === 'development';
const isLocalhost = (origin) => /^http:\/\/localhost:\d+$/.test(origin || '');

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (isDev && isLocalhost(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use(socketAuth);

// Setup socket handlers
setupMessageSocket(io);
setupNotificationSocket(io);
setupTypingSocket(io);
setupOnlineUsersSocket(io);
setupContractSocket(io);

// Make io accessible in routes
app.set('io', io);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (isDev && isLocalhost(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(mongoSanitize());
app.use(xss());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}
app.use(requestLogger);

// Activity tracking
app.use(trackActivity);

// Rate limiting
app.use('/api', apiLimiter);

// Routes
app.use('/', routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Connect to databases and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('MongoDB connected successfully');

    // Skip Redis connection for now (optional)
    logger.info('Redis connection skipped - caching disabled');

    // Start server
    const PORT = config.port;
    httpServer.listen(PORT, () => {
      // Minimal terminal output as requested
      console.log('MongoDB connected successfully');
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  httpServer.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Process terminated');
  });
});

// Start the server
startServer();

export default app;

