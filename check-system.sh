#!/bin/bash

# 🔍 YUMIFY - Pre-Installation Check Script
# Run this before setup to verify your system is ready

echo "================================================"
echo "   🔍 YUMIFY - System Requirements Check"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $2 is installed${NC}"
        if [ ! -z "$3" ]; then
            VERSION=$($3)
            echo -e "   Version: $VERSION"
        fi
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ $2 is NOT installed${NC}"
        echo -e "   Install from: $4"
        ((CHECKS_FAILED++))
        return 1
    fi
    echo ""
}

# Check Node.js
echo "📦 Checking Node.js..."
check_command "node" "Node.js" "node --version" "https://nodejs.org/"
echo ""

# Check npm
echo "📦 Checking npm..."
check_command "npm" "npm" "npm --version" "https://nodejs.org/"
echo ""

# Check MongoDB (optional)
echo "🗄️  Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB is installed (local)${NC}"
    VERSION=$(mongod --version | head -n 1)
    echo -e "   $VERSION"
    ((CHECKS_PASSED++))
elif command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB Shell is installed${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo -e "   You can use MongoDB Atlas (cloud) instead"
    echo -e "   Sign up at: https://www.mongodb.com/cloud/atlas"
fi
echo ""

# Check Git (optional but recommended)
echo "🔧 Checking Git..."
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ Git is installed${NC}"
    VERSION=$(git --version)
    echo -e "   $VERSION"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Git is not installed (optional)${NC}"
    echo -e "   Install from: https://git-scm.com/"
fi
echo ""

# Check disk space
echo "💾 Checking disk space..."
AVAILABLE=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}✅ Available disk space: $AVAILABLE${NC}"
echo -e "   Required: ~500 MB"
echo ""

# Check internet connection
echo "🌐 Checking internet connection..."
if ping -c 1 google.com &> /dev/null; then
    echo -e "${GREEN}✅ Internet connection available${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}❌ No internet connection${NC}"
    echo -e "   Required for: npm install, MongoDB Atlas"
    ((CHECKS_FAILED++))
fi
echo ""

# Summary
echo "================================================"
echo "   📊 CHECK SUMMARY"
echo "================================================"
echo ""
echo -e "Checks passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Checks failed: ${RED}$CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Your system is ready for Yumify!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./setup.sh"
    echo "2. Or follow: QUICKSTART.md"
    echo ""
elif [ $CHECKS_FAILED -le 2 ]; then
    echo -e "${YELLOW}⚠️  Your system is mostly ready${NC}"
    echo ""
    echo "You can proceed with setup, but:"
    echo "- Install missing dependencies first (recommended)"
    echo "- Or use cloud alternatives (MongoDB Atlas)"
    echo ""
else
    echo -e "${RED}❌ Please install required dependencies first${NC}"
    echo ""
    echo "Minimum requirements:"
    echo "- Node.js (v16+)"
    echo "- npm"
    echo "- MongoDB (local or Atlas account)"
    echo ""
fi

echo "================================================"
echo "   📚 DOCUMENTATION"
echo "================================================"
echo ""
echo "- QUICKSTART.md - Quick setup guide"
echo "- README.md - Complete documentation"
echo "- setup.sh - Automated setup"
echo ""
echo "For help, visit: https://nodejs.org/docs/"
echo ""
