#!/bin/bash

# 🚀 YUMIFY - Automated Setup Script
# This script sets up both backend and frontend automatically

set -e  # Exit on any error

echo "================================================"
echo "   🍱 YUMIFY - Automated Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "You can:"
    echo "  1. Install MongoDB locally"
    echo "  2. Use MongoDB Atlas (cloud)"
    echo ""
    read -p "Do you want to continue with MongoDB Atlas? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ MongoDB found${NC}"
fi

echo ""
echo "================================================"
echo "   🖥️  BACKEND SETUP"
echo "================================================"
echo ""

cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ backend/package.json not found${NC}"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Configure your .env file${NC}"
    echo ""
    echo "Please enter your configuration:"
    echo ""
    
    read -p "MongoDB URI (press Enter for local: mongodb://localhost:27017/yumify): " MONGO_URI
    MONGO_URI=${MONGO_URI:-mongodb://localhost:27017/yumify}
    
    # Generate random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Update .env file
    sed -i "s|MONGODB_URI=.*|MONGODB_URI=$MONGO_URI|g" .env
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" .env
    
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${YELLOW}ℹ️  .env file already exists${NC}"
fi

echo ""
echo "================================================"
echo "   🌐 FRONTEND SETUP"
echo "================================================"
echo ""

cd ../frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ frontend/package.json not found${NC}"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env file for frontend
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Frontend .env file created${NC}"
else
    echo -e "${YELLOW}ℹ️  Frontend .env file already exists${NC}"
fi

cd ..

echo ""
echo "================================================"
echo "   ✅ SETUP COMPLETE!"
echo "================================================"
echo ""
echo -e "${GREEN}🎉 Yumify has been set up successfully!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start MongoDB (if using local):"
echo -e "   ${YELLOW}sudo systemctl start mongod${NC}"
echo ""
echo "2. Start the backend server:"
echo -e "   ${YELLOW}cd backend && npm run dev${NC}"
echo "   Backend will run on: http://localhost:5000"
echo ""
echo "3. In a new terminal, start the frontend:"
echo -e "   ${YELLOW}cd frontend && npm run dev${NC}"
echo "   Frontend will run on: http://localhost:5173"
echo ""
echo "4. Open your browser and visit:"
echo -e "   ${GREEN}http://localhost:5173${NC}"
echo ""
echo "================================================"
echo "   📚 DOCUMENTATION"
echo "================================================"
echo ""
echo "- README.md - Complete project documentation"
echo "- FRONTEND_INTEGRATION.md - Frontend setup guide"
echo "- DEPLOYMENT_GUIDE.md - Production deployment"
echo ""
echo "For help, check the documentation or visit:"
echo "http://localhost:5000/api/health (Backend health check)"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
