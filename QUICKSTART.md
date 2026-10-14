# ⚡ YUMIFY - QUICKSTART GUIDE

**Get Yumify running in 5 minutes!**

---

## 🎯 WHAT YOU NEED

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local installation - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (free cloud) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Text Editor** - VS Code, Sublime, or any editor
- **Terminal/Command Prompt**

---

## 🚀 OPTION 1: AUTOMATED SETUP (Recommended)

```bash
# 1. Extract the yumify-complete.zip file
unzip yumify-complete.zip
cd yumify-complete

# 2. Make setup script executable (Linux/Mac)
chmod +x setup.sh

# 3. Run automated setup
./setup.sh

# 4. Follow on-screen instructions!
```

---

## 🔧 OPTION 2: MANUAL SETUP

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file (use nano, vim, or any editor)
nano .env

# Set these values:
MONGODB_URI=mongodb://localhost:27017/yumify
JWT_SECRET=your_random_secret_key_min_32_chars
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Save and exit (Ctrl+X, Y, Enter in nano)

# Start backend
npm run dev
```

✅ Backend should now be running on **http://localhost:5000**

### Step 2: Frontend Setup (2 minutes)

**Open a NEW terminal window**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start frontend
npm run dev
```

✅ Frontend should now be running on **http://localhost:5173**

### Step 3: Access Application

1. Open browser
2. Go to: **http://localhost:5173**
3. Click "Sign Up"
4. Create your account!

---

## 🗄️ MONGODB SETUP

### Using Local MongoDB

```bash
# Check if MongoDB is running
mongosh

# If not installed, install it:
# For Ubuntu/Debian:
sudo apt-get install mongodb

# For Mac:
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac

# Verify
mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
```

### Using MongoDB Atlas (Cloud - Easier!)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (it's free!)
3. Create a free cluster (M0)
4. Create database user
   - Click "Database Access"
   - Add user with username and password
5. Whitelist your IP
   - Click "Network Access"
   - Add IP (or use 0.0.0.0/0 for testing)
6. Get connection string
   - Click "Databases" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
7. Update backend `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yumify?retryWrites=true&w=majority
   ```

---

## ✅ VERIFY EVERYTHING WORKS

### Check Backend

Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Yumify Backend Server is running",
  "mongodb": "Connected"
}
```

### Check Frontend

1. Open: http://localhost:5173
2. Should see Yumify landing page
3. Click "Sign Up"
4. Create an account

---

## 🎮 FIRST TIME USE

### Create Your First Account

1. **Sign Up**
   - Email: your@email.com
   - Password: password123
   - Name: Your Name

2. **Select Role**
   - Choose "Customer" to browse messes
   - OR "Mess Manager" to manage a mess

3. **As Customer:**
   - Browse available messes
   - View menus
   - Add money to wallet
   - Place an order!

4. **As Mess Manager:**
   - Your mess is auto-created
   - Update mess details
   - Manage weekly menu
   - View incoming orders

---

## 🐛 TROUBLESHOOTING

### Backend Not Starting?

```bash
# Check if MongoDB is running
mongosh

# Check port 5000 is not in use
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Check .env file exists
ls -la .env

# View backend logs
npm run dev
# Look for error messages
```

### Frontend Not Starting?

```bash
# Check if port 5173 is not in use
lsof -i :5173  # Linux/Mac
netstat -ano | findstr :5173  # Windows

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### MongoDB Connection Error?

```bash
# For local MongoDB:
sudo systemctl status mongod

# For Atlas:
# - Check username/password
# - Check IP whitelist
# - Check connection string format
```

### CORS Error in Browser?

```bash
# Check backend .env file
cat backend/.env | grep CORS_ORIGIN

# Should be:
CORS_ORIGIN=http://localhost:5173

# Restart backend after changing .env
```

### "Mess not found" Error?

This means frontend is not connected to backend properly.

```bash
# Check frontend .env:
cat frontend/.env

# Should have:
VITE_API_BASE_URL=http://localhost:5000/api

# Restart frontend after changing .env
```

---

## 📝 DEFAULT TEST ACCOUNTS

You can create these for testing:

**Customer Account:**
```
Email: customer@test.com
Password: password123
Role: Customer
```

**Mess Manager Account:**
```
Email: manager@test.com
Password: password123
Role: Mess Manager
```

---

## 🎯 COMMON TASKS

### Add Money to Wallet
1. Login as customer
2. Click "Wallet" in sidebar
3. Click "Add Money"
4. Enter amount (e.g., 500)
5. Click "Add"

### Place an Order
1. Browse messes from home
2. Click "View Menu" on any mess
3. Select meals (breakfast/lunch/dinner)
4. Click "Book Now"
5. Select payment method (Wallet)
6. Confirm order

### Update Menu (Manager)
1. Login as mess manager
2. Click "Menu" in sidebar
3. Update prices or meal names
4. Click "Save Changes"

### View Orders (Manager)
1. Click "Dashboard"
2. See recent orders
3. Update status to "Completed"

---

## 📚 NEXT STEPS

After getting it running:

1. **Read Full Documentation**: Check `README.md` for complete features
2. **Understand Code Structure**: Review `README.md` Project Structure section
3. **Frontend Integration**: See `FRONTEND_INTEGRATION.md` for connecting frontend
4. **Deployment**: Check `DEPLOYMENT_GUIDE.md` for production deployment
5. **Customization**: Modify branding, add features, etc.

---

## 🆘 GETTING HELP

### Documentation Files
- `README.md` - Complete documentation
- `FRONTEND_INTEGRATION.md` - Frontend setup details
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `backend/.env.example` - Environment variable examples

### Check Logs
```bash
# Backend logs
cd backend
npm run dev
# Watch for errors

# Frontend logs
cd frontend
npm run dev
# Watch browser console
```

### Health Checks
```bash
# Backend health
curl http://localhost:5000/api/health

# Check if services are running
ps aux | grep node
```

---

## 📊 SYSTEM REQUIREMENTS

### Minimum
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Disk**: 500 MB
- **OS**: Windows 10, macOS 10.14+, Ubuntu 18.04+

### Recommended
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Disk**: 1 GB
- **OS**: Latest version

---

## ✨ FEATURES TO TEST

- [x] User signup/login
- [x] Role selection (Customer/Manager)
- [x] Browse messes
- [x] View mess details and menu
- [x] Place order
- [x] Wallet operations (add money)
- [x] Order history
- [x] Manager dashboard
- [x] Menu management
- [x] Order status updates
- [x] Reviews and ratings
- [x] Community posts
- [x] Analytics
- [x] Dark mode
- [x] Responsive design

---

## 🎉 SUCCESS!

If you can:
1. Access http://localhost:5173
2. Sign up an account
3. Select a role
4. See messes (customer) or dashboard (manager)

**Congratulations! Yumify is running! 🚀**

---

## 🔥 PRO TIPS

1. **Use MongoDB Atlas**: Easier than local setup
2. **Use Two Terminals**: One for backend, one for frontend
3. **Check Health Endpoint**: http://localhost:5000/api/health
4. **Clear Browser Cache**: If you see old data
5. **Use Postman**: Test API endpoints directly
6. **Check Both Logs**: Backend terminal and browser console
7. **Keep .env Safe**: Don't commit it to git!

---

## 📌 IMPORTANT PORTS

- **Backend API**: http://localhost:5000
- **Frontend UI**: http://localhost:5173
- **MongoDB**: mongodb://localhost:27017
- **Health Check**: http://localhost:5000/api/health

---

## 🚦 STATUS INDICATORS

**Backend is running when:**
- Terminal shows "Yumify Backend Server running on port 5000"
- Terminal shows "MongoDB Connected"
- Health endpoint returns status OK

**Frontend is running when:**
- Terminal shows "Local: http://localhost:5173"
- Browser shows Yumify welcome page
- No errors in browser console

**Everything is working when:**
- You can signup/login
- Messes are visible
- Orders can be placed
- Wallet shows balance

---

**Happy Coding! 🎉🍱**
