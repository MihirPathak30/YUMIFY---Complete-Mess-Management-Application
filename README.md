# 🍱 YUMIFY - Complete Mess Management Application

**A Full-Stack Web Application for Mess Management and Food Ordering**

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Installation Guide](#installation-guide)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Security Implementation](#security-implementation)
9. [Project Structure](#project-structure)
10. [Academic Documentation](#academic-documentation)

---

## 📌 PROJECT OVERVIEW

Yumify is a comprehensive web-based platform that connects customers with local mess services. The application provides:

- **For Customers**: Browse messes, view menus, place orders, manage wallet, track orders
- **For Mess Managers**: Manage menus, view orders, post community updates, analyze business metrics
- **Real-time Updates**: Order status, wallet balance, notifications
- **Digital Receipts**: Automatic receipt generation for all orders
- **AI Assistant**: Smart recommendations and help system

---

## ✨ FEATURES

### Customer Features
- 🔍 **Browse Messes**: Search and filter by cuisine, price, rating
- 📋 **View Menus**: Weekly menu with breakfast, lunch, dinner options
- 🛒 **Place Orders**: Book meals with multiple payment options
- 💰 **Digital Wallet**: Add money, track transactions, instant payments
- 📊 **Order History**: View past orders with receipt download
- ⭐ **Reviews & Ratings**: Rate messes and provide feedback
- 💬 **AI Assistant**: Get recommendations and assistance
- 🌙 **Dark Mode**: Complete light/dark theme support

### Mess Manager Features
- 🏪 **Mess Management**: Create and manage mess profile
- 📝 **Menu Management**: Update daily/weekly menus
- 📦 **Order Management**: View and update order status
- 📢 **Community Posts**: Share announcements, offers, updates
- 📈 **Analytics Dashboard**: Revenue, orders, customer insights
- 👥 **Customer Feedback**: View reviews and ratings

### System Features
- 🔐 **Authentication & Authorization**: JWT-based secure access
- 🔄 **Real-time Updates**: Instant order and wallet updates
- 📱 **Responsive Design**: Works on all devices
- 🧾 **Receipt Generation**: Automatic digital receipts
- 🛡️ **Role-Based Access Control**: Customer and Manager roles
- 💾 **Data Persistence**: MongoDB database

---

## 🛠️ TECHNOLOGY STACK

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Shadcn/UI**: Beautiful component library
- **Vite**: Fast build tool

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing

### Development Tools
- **Nodemon**: Auto-restart development server
- **ESLint**: Code linting
- **dotenv**: Environment configuration

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT TIER                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │         React Frontend (Port 5173)                │   │
│  │  - Components: Pages, Layouts, UI Components     │   │
│  │  - Context: Auth, Wallet, AppData, Theme         │   │
│  │  - Routing: React Router                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION TIER                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Express.js Backend (Port 5000)               │   │
│  │  - Routes: API endpoints                         │   │
│  │  - Controllers: Business logic                   │   │
│  │  - Middleware: Auth, Validation                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────┐
│                      DATA TIER                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         MongoDB Database                          │   │
│  │  - Collections: Users, Messes, Orders, etc.     │   │
│  │  - Indexes: Optimized queries                    │   │
│  │  - Relationships: Referenced documents           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 INSTALLATION GUIDE

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) installed locally OR MongoDB Atlas account
- npm or yarn package manager

### Step 1: Clone/Extract Project
```bash
# Extract the yumify-complete.zip file
# Navigate to project directory
cd yumify-complete
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env file with your configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/yumify

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yumify

# Start backend server
npm run dev
# OR
npm start
```

Backend will run on: **http://localhost:5000**

### Step 3: Frontend Setup
```bash
# Open new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Step 4: Access Application
1. Open browser: **http://localhost:5173**
2. Sign up as new user
3. Select role (Customer or Mess Manager)
4. Start using the application!

---

## 🔌 API DOCUMENTATION

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/signup` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| GET | `/auth/logout` | Logout user | Private |

### User Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PUT | `/users/role` | Update user role | Private |
| GET | `/users/profile` | Get user profile | Private |
| PUT | `/users/profile` | Update profile | Private |

### Mess Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/messes` | Get all messes | Public |
| GET | `/messes/:id` | Get mess details | Public |
| GET | `/messes/my/mess` | Get my mess | Manager |
| POST | `/messes` | Create mess | Manager |
| PUT | `/messes/:id` | Update mess | Manager |

### Menu Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/menus/mess/:messId` | Get mess menu | Public |
| PUT | `/menus/mess/:messId` | Update full menu | Manager |
| PUT | `/menus/mess/:messId/day/:day` | Update day menu | Manager |

### Order Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/orders` | Create order | Customer |
| GET | `/orders` | Get user orders | Private |
| GET | `/orders/:id` | Get order details | Private |
| GET | `/orders/mess/:messId` | Get mess orders | Manager |
| PUT | `/orders/:id/status` | Update order status | Manager |
| PUT | `/orders/:id/cancel` | Cancel order | Customer |

### Wallet Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/wallet` | Get wallet balance | Private |
| POST | `/wallet/add` | Add money | Private |
| POST | `/wallet/withdraw` | Withdraw money | Private |
| GET | `/wallet/transactions` | Get transactions | Private |

### Review Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reviews/mess/:messId` | Get mess reviews | Public |
| POST | `/reviews` | Create review | Customer |
| PUT | `/reviews/:id` | Update review | Customer |
| DELETE | `/reviews/:id` | Delete review | Customer |

### Community Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/community` | Get all posts | Public |
| GET | `/community/mess/:messId` | Get mess posts | Public |
| POST | `/community` | Create post | Manager |
| PUT | `/community/:id` | Update post | Manager |
| DELETE | `/community/:id` | Delete post | Manager |

### Analytics Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/mess/:messId` | Get mess analytics | Manager |
| GET | `/analytics/customer` | Get customer analytics | Customer |

### AI Assistant Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/ai-assistant/chat` | Chat with AI | Customer |
| GET | `/ai-assistant/suggestions` | Get suggestions | Customer |

---

## 🗄️ DATABASE SCHEMA

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['customer', 'mess_manager']),
  phone: String,
  avatar: String,
  isActive: Boolean,
  messId: ObjectId (ref: Mess),
  createdAt: Date,
  updatedAt: Date
}
```

### Messes Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  owner: ObjectId (ref: User, required),
  description: String,
  address: String (required),
  phone: String (required),
  cuisineType: String,
  priceRange: { min: Number, max: Number },
  timing: String,
  isOpen: Boolean,
  popular: Boolean,
  image: String,
  location: { latitude: Number, longitude: Number },
  amenities: [String],
  specialities: [String],
  rating: { average: Number, count: Number },
  totalCustomers: Number,
  yearsActive: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  mess: ObjectId (ref: Mess, required),
  meals: [{
    type: String (enum: ['breakfast', 'lunch', 'dinner']),
    name: String,
    price: Number
  }],
  orderDate: Date (required),
  totalAmount: Number (required),
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled']),
  paymentMethod: String (enum: ['wallet', 'cash', 'upi', 'card']),
  receiptGenerated: Boolean,
  receiptUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Wallets Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, unique, required),
  balance: Number (default: 0, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  type: String (enum: ['credit', 'debit'], required),
  amount: Number (required, min: 0),
  description: String (required),
  balanceAfter: Number (required),
  referenceId: String (order ID),
  createdAt: Date,
  updatedAt: Date
}
```

### Menus Collection
```javascript
{
  _id: ObjectId,
  mess: ObjectId (ref: Mess, unique, required),
  weeklyMenu: [{
    day: String (enum: weekdays, required),
    breakfast: { name: String, price: Number, available: Boolean },
    lunch: { name: String, price: Number, available: Boolean },
    dinner: { name: String, price: Number, available: Boolean }
  }],
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection
```javascript
{
  _id: ObjectId,
  mess: ObjectId (ref: Mess, required),
  user: ObjectId (ref: User, required),
  rating: Number (min: 1, max: 5, required),
  comment: String (required),
  helpful: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
// Unique constraint: (mess, user)
```

### CommunityPosts Collection
```javascript
{
  _id: ObjectId,
  mess: ObjectId (ref: Mess, required),
  type: String (enum: ['announcement', 'menu_update', 'offer', 'holiday']),
  title: String (required),
  content: String (required),
  likes: Number (default: 0),
  comments: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 SECURITY IMPLEMENTATION

### Password Security
- **Bcrypt Hashing**: All passwords hashed with bcrypt (salt rounds: 10)
- **No Plain Text**: Passwords never stored or transmitted in plain text
- **Secure Comparison**: Using bcrypt.compare for authentication

### JWT Authentication
- **Token-Based**: JWT tokens for stateless authentication
- **Expiration**: Configurable token expiry (default: 30 days)
- **HTTP Headers**: Tokens sent via Authorization header
- **Secret Key**: Strong secret key in environment variables

### Authorization
- **Role-Based Access Control**: Customer and Manager roles
- **Route Protection**: Middleware validates user authentication
- **Resource Ownership**: Users can only access/modify own resources
- **API Security**: Protected endpoints require valid JWT

### Data Validation
- **Input Validation**: All inputs validated before processing
- **Mongoose Schema**: Schema-level validation
- **Error Handling**: Proper error messages without exposing internals
- **SQL Injection**: Protected by MongoDB (NoSQL)

### Best Practices
- **Environment Variables**: Sensitive data in .env (not committed)
- **CORS Configuration**: Controlled cross-origin requests
- **Error Logging**: Server-side logging without exposing to client
- **HTTPS Ready**: Can be deployed with SSL/TLS

---

## 📁 PROJECT STRUCTURE

```
yumify-complete/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── messController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── walletController.js
│   │   ├── reviewController.js
│   │   ├── communityController.js
│   │   ├── analyticsController.js
│   │   └── aiAssistantController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Mess.js
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   ├── Wallet.js
│   │   ├── Review.js
│   │   └── CommunityPost.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── messes.js
│   │   ├── menus.js
│   │   ├── orders.js
│   │   ├── wallet.js
│   │   ├── reviews.js
│   │   ├── community.js
│   │   ├── analytics.js
│   │   └── ai-assistant.js
│   ├── utils/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── WalletContext.tsx
│   │   │   ├── AppDataContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── Welcome.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── SelectRole.tsx
│   │   │   ├── CustomerHome.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MessDetails.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Wallet.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── MenuManagement.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Community.tsx
│   │   │   ├── AIAssistant.tsx
│   │   │   └── Settings.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

---

## 📚 ACADEMIC DOCUMENTATION

### Introduction

**Yumify** is a web-based mess management system designed to bridge the gap between mess services and customers. The application provides a centralized platform for:

1. Customers to discover, browse, and order from local messes
2. Mess managers to manage their business operations digitally
3. Real-time order tracking and payment processing
4. Business analytics and customer feedback

### Problem Statement

Traditional mess services face several challenges:
- **Limited Reach**: Customers struggle to find quality mess services
- **Manual Operations**: Mess owners manage orders manually (phone/paper)
- **Payment Issues**: Cash handling and payment tracking problems
- **No Analytics**: Lack of business insights and customer feedback
- **Communication Gap**: No platform for announcements and updates

### Solution

Yumify addresses these problems through:
- **Digital Platform**: Web-based access from any device
- **Automated Ordering**: Streamlined order placement and tracking
- **Digital Payments**: Integrated wallet system for cashless transactions
- **Analytics Dashboard**: Real-time business metrics for mess owners
- **Community Features**: Announcements, offers, and customer reviews

### System Design

#### Architecture Pattern
**Three-Tier Architecture**:
1. **Presentation Layer**: React-based frontend with responsive UI
2. **Application Layer**: Express.js REST API with business logic
3. **Data Layer**: MongoDB database with Mongoose ODM

#### Design Principles
- **Separation of Concerns**: Clear separation between layers
- **RESTful API**: Standard HTTP methods and status codes
- **MVC Pattern**: Model-View-Controller in backend
- **Component-Based**: Reusable React components
- **Responsive Design**: Mobile-first approach

### Implementation Details

#### Frontend Implementation
- **React Hooks**: useState, useEffect, useContext for state management
- **Context API**: Global state management (Auth, Wallet, AppData)
- **React Router**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first styling with custom components
- **TypeScript**: Type safety and better developer experience

#### Backend Implementation
- **Express Middleware**: Request processing pipeline
- **JWT Authentication**: Secure token-based authentication
- **Mongoose Models**: Schema definition and validation
- **Error Handling**: Centralized error handling middleware
- **RESTful Routes**: Standard CRUD operations

#### Database Design
- **Document-Oriented**: MongoDB's flexible schema
- **References**: Related documents via ObjectId
- **Indexes**: Optimized queries for performance
- **Validation**: Schema-level data validation

### Key Features Explained

#### 1. Authentication System
- User registration with email/password
- Secure password hashing using bcrypt
- JWT token generation and validation
- Role-based access control (Customer/Manager)

#### 2. Order Management
- Browse messes with filtering options
- View weekly menus with pricing
- Multi-meal order placement
- Real-time order status tracking
- Automatic wallet deduction
- Digital receipt generation

#### 3. Wallet System
- Add money to digital wallet
- Instant payment processing
- Transaction history tracking
- Automatic refunds for cancellations
- Balance synchronization

#### 4. Mess Management
- Create and update mess profile
- Manage weekly menus
- View incoming orders
- Update order status
- Post community announcements
- View business analytics

#### 5. Analytics Dashboard
- Order statistics and trends
- Revenue tracking
- Popular meal analysis
- Customer insights
- Daily/weekly/monthly reports

### Technical Feasibility

#### Technology Choices
1. **Node.js**: 
   - JavaScript runtime for backend
   - Large ecosystem (npm packages)
   - Non-blocking I/O for scalability

2. **Express.js**:
   - Minimal and flexible framework
   - Robust routing system
   - Middleware support

3. **MongoDB**:
   - Flexible document schema
   - Horizontal scalability
   - JSON-like documents
   - Rich query language

4. **React**:
   - Component reusability
   - Virtual DOM for performance
   - Large community support
   - Rich ecosystem

#### Scalability Considerations
- **Horizontal Scaling**: Add more server instances
- **Database Indexing**: Optimized queries
- **Caching**: Redis can be added for session management
- **CDN**: Static assets can be served via CDN
- **Load Balancing**: Distribute traffic across servers

### Testing Strategy

#### Manual Testing
- User registration and login flows
- Order placement end-to-end
- Wallet transactions
- Menu management
- Analytics accuracy

#### API Testing
- Postman/Thunder Client for endpoint testing
- Authentication token validation
- Error handling verification
- Response format validation

### Deployment Considerations

#### Backend Deployment
- **Options**: Heroku, AWS EC2, Digital Ocean, Railway
- **Environment**: Production environment variables
- **Database**: MongoDB Atlas (cloud database)
- **Monitoring**: Logging and error tracking

#### Frontend Deployment
- **Options**: Vercel, Netlify, AWS S3 + CloudFront
- **Build**: Optimized production build
- **Environment**: API endpoint configuration
- **CDN**: Global content delivery

### Future Enhancements

1. **Subscription Plans**: Monthly meal subscriptions
2. **Rating System**: Detailed rating for each meal type
3. **Notification System**: Push notifications for orders
4. **Chat Support**: Real-time customer support
5. **Advanced Analytics**: Predictive analytics using ML
6. **Mobile App**: Native Android/iOS applications
7. **Payment Gateway**: Integration with Razorpay/Stripe
8. **Meal Recommendations**: AI-based personalized suggestions
9. **Delivery Tracking**: Real-time delivery status
10. **Multi-language**: Support for regional languages

### Conclusion

Yumify successfully demonstrates a modern web application built with industry-standard technologies. The project implements:

- Complete authentication and authorization
- Real-time data synchronization
- Secure payment processing
- Business analytics
- Responsive user interface
- Scalable architecture

The application is production-ready and can be deployed to serve real users. It showcases understanding of full-stack development, database design, API development, and modern web technologies.

### References

1. **MongoDB Documentation**: https://docs.mongodb.com/
2. **Express.js Guide**: https://expressjs.com/
3. **React Documentation**: https://react.dev/
4. **Node.js Docs**: https://nodejs.org/docs/
5. **JWT Authentication**: https://jwt.io/introduction
6. **RESTful API Design**: https://restfulapi.net/

---

## 🎓 VIVA PREPARATION

### Common Questions and Answers

**Q: What is the architecture of your application?**
A: We use a three-tier architecture:
- Frontend (React) handles UI and user interactions
- Backend (Express.js) processes business logic and API requests
- Database (MongoDB) stores all application data

**Q: How does authentication work?**
A: We use JWT (JSON Web Tokens). When a user logs in, the server verifies credentials, generates a JWT token, and sends it to the client. The client includes this token in subsequent requests. The server validates the token using middleware before processing requests.

**Q: Why did you choose MongoDB over SQL?**
A: MongoDB offers:
- Flexible schema (easy to modify data structure)
- Document-oriented (natural fit for JavaScript/JSON)
- Scalability (horizontal scaling)
- Fast development (no complex joins)

**Q: Explain the order flow from customer to mess owner?**
A:
1. Customer browses messes and views menu
2. Customer selects meals and places order
3. Payment deducted from wallet (if wallet payment)
4. Order saved in database with "confirmed" status
5. Order appears in customer's order history
6. Mess manager sees order in their dashboard
7. Manager updates status (completed/cancelled)
8. Customer receives updated status

**Q: How do you ensure payment security?**
A:
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Authorization checks before wallet operations
- Transaction atomicity (debit and order creation together)
- No sensitive data in responses

**Q: What happens if an order is cancelled?**
A: 
1. Customer/Manager initiates cancellation
2. Order status updated to "cancelled"
3. If paid via wallet, amount is refunded automatically
4. Refund transaction created in wallet history
5. Customer sees updated balance and transaction

**Q: How does the receipt generation work?**
A: When an order is confirmed:
1. Order data stored in database
2. Receipt flag marked as generated
3. Order details include all necessary information (Order ID, items, amount, date, payment method)
4. Frontend can generate printable receipt from this data

**Q: Can you scale this application?**
A: Yes, through:
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Distribute data across servers
- **Caching**: Redis for session and frequently accessed data
- **CDN**: Serve static assets globally
- **Microservices**: Split into smaller services

**Q: What testing did you perform?**
A:
- Manual testing of all user flows
- API testing using Postman
- Authentication and authorization testing
- Payment flow testing
- Edge case handling (insufficient balance, invalid data)

**Q: How is this different from Zomato/Swiggy?**
A: Yumify focuses specifically on mess services (monthly subscriptions, home-style food) rather than restaurant delivery. Features like wallet system, weekly menus, and mess-specific analytics are tailored for this use case.

---

## 📝 LICENSE

This project is created for academic purposes as a college final year project.

---

## 👥 SUPPORT

For any issues or questions:
1. Check the README documentation
2. Review API documentation
3. Check MongoDB connection and environment variables
4. Ensure both frontend and backend servers are running

---

## 🚀 QUICK START SUMMARY

```bash
# 1. Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev

# 2. Frontend Setup (new terminal)
cd frontend
npm install
npm run dev

# 3. Access Application
# Open: http://localhost:5173
# API: http://localhost:5000/api
# Health: http://localhost:5000/api/health
```

---

**Made with ❤️ for Academic Project**
**College Submission 2024**
