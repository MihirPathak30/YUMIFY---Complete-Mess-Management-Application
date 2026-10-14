# 🚀 DEPLOYMENT GUIDE FOR YUMIFY

## Complete Step-by-Step Deployment Instructions

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] MongoDB database set up (local or Atlas)
- [ ] Node.js v16+ installed
- [ ] npm or yarn installed
- [ ] Backend `.env` configured
- [ ] Frontend environment configured

---

## 🗄️ DATABASE SETUP

### Option 1: Local MongoDB

```bash
# Install MongoDB Community Edition
# For Ubuntu/Debian:
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
```

### Option 2: MongoDB Atlas (Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier M0 available)
4. Create database user (username + password)
5. Whitelist your IP address (or use 0.0.0.0/0 for testing)
6. Get connection string:

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/yumify?retryWrites=true&w=majority
```

---

## 🖥️ BACKEND DEPLOYMENT

### Local Development

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # or use any text editor

# Edit .env file:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yumify  # or Atlas URI
JWT_SECRET=your_random_secret_key_here_change_in_production
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173

# Start server
npm run dev  # Development with auto-reload
# OR
npm start    # Production mode
```

### Production Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create yumify-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_strong_secret_key"
heroku config:set JWT_EXPIRE=30d
heroku config:set CORS_ORIGIN="https://your-frontend-url.com"

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a yumify-backend
git push heroku main

# View logs
heroku logs --tail
```

### Production Deployment (AWS EC2 Example)

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Clone/Upload your code
git clone your-repo-url
cd yumify-complete/backend

# Install dependencies
npm install --production

# Configure .env
nano .env
# Add production values

# Start with PM2
pm2 start server.js --name yumify-backend
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/yumify

# Nginx configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/yumify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🌐 FRONTEND DEPLOYMENT

### Local Development

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable on Vercel dashboard:
# VITE_API_BASE_URL = https://your-backend-url.com/api

# Production deployment
vercel --prod
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# For production
netlify deploy --prod

# Or use Netlify web interface:
# 1. Go to https://app.netlify.com/
# 2. Drag and drop the 'dist' folder
# 3. Set environment variable: VITE_API_BASE_URL
```

### Deploy to AWS S3 + CloudFront

```bash
# Build
npm run build

# Install AWS CLI
pip install awscli

# Configure AWS
aws configure

# Create S3 bucket
aws s3 mb s3://yumify-frontend

# Enable static website hosting
aws s3 website s3://yumify-frontend --index-document index.html

# Upload files
aws s3 sync dist/ s3://yumify-frontend --acl public-read

# Create CloudFront distribution (for HTTPS and CDN)
# Use AWS Console or CLI
```

---

## 🔧 POST-DEPLOYMENT CONFIGURATION

### Update CORS Origin

After deploying frontend, update backend CORS:

```bash
# On Heroku
heroku config:set CORS_ORIGIN="https://yumify-frontend.vercel.app"

# On EC2 (update .env)
nano /path/to/backend/.env
# Change CORS_ORIGIN to your frontend URL
pm2 restart yumify-backend
```

### Update Frontend API URL

```bash
# On Vercel/Netlify
# Go to dashboard → Environment Variables
# Set: VITE_API_BASE_URL = https://your-backend.herokuapp.com/api
```

---

## 🗃️ DATABASE INITIALIZATION

### Seed Demo Data (Optional)

Create `backend/seed.js`:

```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
const Mess = require('./models/Mess');
const Menu = require('./models/Menu');
require('dotenv').config();

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Clear existing data
  await User.deleteMany({});
  await Mess.deleteMany({});
  await Menu.deleteMany({});
  
  // Create demo users
  const customer = await User.create({
    email: 'customer@test.com',
    password: 'password123',
    name: 'Test Customer',
    role: 'customer'
  });
  
  const manager = await User.create({
    email: 'manager@test.com',
    password: 'password123',
    name: 'Test Manager',
    role: 'mess_manager'
  });
  
  // Create demo mess
  const mess = await Mess.create({
    name: 'Demo Mess',
    owner: manager._id,
    address: 'Test Address, City',
    phone: '+91 9876543210',
    cuisineType: 'North Indian',
    priceRange: { min: 50, max: 100 }
  });
  
  // Create demo menu
  await Menu.create({
    mess: mess._id,
    weeklyMenu: [
      {
        day: 'Monday',
        breakfast: { name: 'Poha + Tea', price: 40, available: true },
        lunch: { name: 'Dal Rice', price: 70, available: true },
        dinner: { name: 'Paneer Curry', price: 90, available: true }
      }
      // Add other days...
    ]
  });
  
  console.log('Database seeded successfully!');
  process.exit(0);
};

seedDatabase();
```

Run: `node seed.js`

---

## 🔒 PRODUCTION SECURITY CHECKLIST

### Backend Security

- [ ] Strong JWT_SECRET (min 32 characters random)
- [ ] CORS configured for specific origin (not *)
- [ ] Environment variables properly set
- [ ] HTTPS enabled
- [ ] MongoDB authentication enabled
- [ ] Rate limiting implemented (optional)
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose internal details

### Frontend Security

- [ ] API keys not exposed in code
- [ ] HTTPS enabled
- [ ] Content Security Policy headers
- [ ] XSS protection enabled
- [ ] Secure cookie flags

### Database Security

- [ ] Strong database password
- [ ] IP whitelist configured
- [ ] Regular backups enabled
- [ ] Connection string not exposed

---

## 📊 MONITORING AND LOGS

### Backend Monitoring

```bash
# Using PM2
pm2 logs yumify-backend
pm2 monit

# Using Heroku
heroku logs --tail --app yumify-backend

# Check application health
curl https://your-backend.com/api/health
```

### Database Monitoring

```bash
# MongoDB Atlas Dashboard
# - View metrics
# - Set up alerts
# - Monitor performance

# Local MongoDB
mongosh
use yumify
db.stats()
db.users.count()
db.orders.count()
```

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**Problem**: Server not starting
```bash
# Check MongoDB connection
mongosh --eval 'db.runCommand({ connectionStatus: 1 })'

# Check logs
npm run dev
# Look for connection errors
```

**Problem**: CORS errors
```bash
# Verify CORS_ORIGIN matches frontend URL exactly
# Check browser console for exact error
# Ensure backend is running
```

**Problem**: JWT errors
```bash
# Check JWT_SECRET is set
echo $JWT_SECRET
# Clear browser localStorage
# Login again
```

### Frontend Issues

**Problem**: API calls failing
```bash
# Check VITE_API_BASE_URL
echo $VITE_API_BASE_URL

# Test backend health
curl https://your-backend.com/api/health

# Check browser console for errors
```

**Problem**: Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔄 UPDATE AND MAINTENANCE

### Backend Updates

```bash
cd backend

# Pull latest code
git pull

# Install new dependencies
npm install

# Restart server
pm2 restart yumify-backend

# Or on Heroku
git push heroku main
```

### Frontend Updates

```bash
cd frontend

# Pull latest code
git pull

# Rebuild
npm install
npm run build

# Redeploy
vercel --prod
# or
netlify deploy --prod
```

### Database Migrations

```bash
# Create backup first
mongodump --uri="mongodb_uri" --out=backup/

# Run migration script
node migrations/add-new-field.js

# Verify changes
mongosh
use yumify
db.users.findOne()
```

---

## 📈 SCALING CONSIDERATIONS

### When to Scale

- Response time > 2 seconds
- Database queries slow
- High memory usage
- Increased traffic

### Scaling Options

1. **Vertical Scaling**: Upgrade server resources
2. **Horizontal Scaling**: Add more server instances
3. **Database Scaling**: 
   - Add indexes
   - Use replica sets
   - Implement caching (Redis)
4. **CDN**: Use CloudFront/Cloudflare for static assets
5. **Load Balancer**: Distribute traffic across servers

---

## 🎯 PRODUCTION CHECKLIST

Before going live:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] Environment variables set correctly
- [ ] HTTPS enabled on both
- [ ] CORS configured properly
- [ ] Test user signup/login
- [ ] Test order flow end-to-end
- [ ] Test wallet operations
- [ ] Check all pages load
- [ ] Mobile responsive tested
- [ ] Error handling tested
- [ ] Backup strategy in place
- [ ] Monitoring set up

---

## 📚 USEFUL COMMANDS

```bash
# Backend
npm install          # Install dependencies
npm run dev          # Development mode
npm start            # Production mode
npm run lint         # Check code quality

# Frontend
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build locally

# Database
mongosh                    # MongoDB shell
mongodump                  # Backup database
mongorestore              # Restore database

# PM2 (Process Manager)
pm2 start server.js       # Start app
pm2 stop yumify-backend   # Stop app
pm2 restart yumify-backend # Restart app
pm2 logs yumify-backend   # View logs
pm2 monit                 # Monitor all apps

# Git
git status               # Check status
git add .                # Stage changes
git commit -m "message"  # Commit
git push                 # Push to remote
```

---

## 🆘 GETTING HELP

If you encounter issues:

1. Check server logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Check MongoDB connection
5. Review browser console errors
6. Refer to README.md documentation

---

**Good luck with your deployment! 🚀**

---

## 📝 LICENSE

Academic Project - College Submission 2024
