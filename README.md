# 🚀 Freelancer Marketplace Platform

A comprehensive freelancer marketplace platform (like Upwork) built with Node.js, Express, MongoDB, and modern web technologies.

## 📁 Project Structure

```
freelancerCli/
├── backend/                    # Backend API server
│   ├── src/                   # Source code
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.io handlers
│   │   ├── jobs/            # Background jobs
│   │   ├── utils/           # Utility functions
│   │   ├── views/           # Email templates
│   │   └── server.js        # Main server file
│   ├── logs/                # Log files
│   ├── uploads/             # File uploads
│   ├── .env                 # Environment variables
│   ├── .gitignore          # Git ignore rules
│   └── package.json        # Backend dependencies
├── frontend/                 # Frontend application (React/Next.js)
├── docs/                    # Documentation
├── .env.example            # Environment template
├── package.json            # Root package.json
└── README.md               # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching & sessions
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Cloudinary** - File storage
- **Bull** - Job queues
- **Nodemailer** - Email service

### Features
- 🔐 **Authentication & Authorization** (JWT, 2FA, Email verification)
- 💼 **Job Management** (Post, search, apply, manage)
- 💰 **Payment Processing** (Stripe integration, escrow, payouts)
- 💬 **Real-time Messaging** (Socket.io, typing indicators)
- 📊 **Analytics & Reporting** (User stats, platform metrics)
- 🔔 **Notifications** (Email, in-app, SMS)
- 📁 **File Management** (Upload, download, Cloudinary)
- 🛡️ **Security** (Rate limiting, XSS protection, input validation)
- 👥 **User Management** (Profiles, KYC, roles)
- 📈 **Admin Dashboard** (User management, analytics)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd freelancerCli
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
npm run install:backend
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example backend/.env

# Edit the .env file with your credentials
# See ENV_SETUP_GUIDE.md for detailed instructions
```

### 4. Start Development Server
```bash
# Start backend server
npm run dev

# Or start from backend directory
cd backend
npm run dev
```

### 5. Access the API
- **API Base URL**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/health`
- **API Documentation**: See `API_ENDPOINTS.md`

## 📋 Environment Variables

### Required (Minimum)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/freelancer_marketplace
JWT_SECRET=your_generated_secret
JWT_REFRESH_SECRET=your_generated_refresh_secret
SESSION_SECRET=your_generated_session_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Recommended (Full Features)
```env
# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**See `ENV_SETUP_GUIDE.md` for complete setup instructions.**

## 🏗️ Development

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Project Structure Details

#### Backend (`backend/src/`)
- **`config/`** - Database, Redis, environment configuration
- **`controllers/`** - Route handlers for all API endpoints
- **`middleware/`** - Authentication, validation, error handling
- **`models/`** - MongoDB schemas and models
- **`routes/`** - API route definitions
- **`services/`** - Business logic and external service integrations
- **`sockets/`** - Real-time communication handlers
- **`jobs/`** - Background job processors
- **`utils/`** - Helper functions and utilities
- **`views/`** - Email templates

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Password reset
- `POST /api/v1/auth/verify-email` - Email verification

### Job Management
- `GET /api/v1/jobs` - Get all jobs
- `POST /api/v1/jobs` - Create job
- `GET /api/v1/jobs/:id` - Get job by ID
- `PUT /api/v1/jobs/:id` - Update job
- `DELETE /api/v1/jobs/:id` - Delete job

### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/:id` - Get user by ID

### Payment Processing
- `POST /api/v1/payments` - Process payment
- `GET /api/v1/payments/transactions` - Get transactions
- `POST /api/v1/payments/payout` - Request payout

**See `API_ENDPOINTS.md` for complete API reference.**

## 🔧 Configuration

### Database Setup
1. **MongoDB**: Install locally or use MongoDB Atlas
2. **Redis**: Install locally or use Redis Cloud

### External Services
1. **Cloudinary**: File storage and image processing
2. **Stripe**: Payment processing
3. **Email Service**: Gmail, SendGrid, or Mailgun
4. **SMS Service**: Twilio (optional)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Use production database URLs
3. Configure production email service
4. Set up SSL certificates
5. Configure reverse proxy (Nginx)

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
REDIS_HOST=your-redis-host
STRIPE_SECRET_KEY=sk_live_...
EMAIL_HOST=smtp.sendgrid.net
```

## 🛡️ Security Features

- **JWT Authentication** with refresh tokens
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **XSS Protection** with helmet.js
- **CORS Configuration** for cross-origin requests
- **Password Hashing** with bcrypt
- **Two-Factor Authentication** support
- **KYC Verification** for enhanced security

## 📊 Monitoring & Logging

- **Winston Logger** for structured logging
- **Morgan** for HTTP request logging
- **Activity Tracking** for user actions
- **Error Handling** with detailed error responses
- **Health Checks** for service monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

- **Documentation**: See `docs/` folder
- **API Reference**: `API_ENDPOINTS.md`
- **Setup Guide**: `ENV_SETUP_GUIDE.md`
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`

## 🎯 Roadmap

- [ ] Frontend React application
- [ ] Mobile app (React Native)
- [ ] Advanced search with Elasticsearch
- [ ] Video calling integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API rate limiting tiers
- [ ] Advanced security features

---

**Happy Coding! 🚀**

For detailed setup instructions, see `ENV_SETUP_GUIDE.md`
For complete API documentation, see `API_ENDPOINTS.md`