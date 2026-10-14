# 🔧 FRONTEND INTEGRATION GUIDE

## ⚠️ CRITICAL: Removing Supabase Dependencies

The uploaded frontend is currently connected to Supabase (cloud backend). **You MUST replace all Supabase calls with standard HTTP API calls to our Express backend.**

---

## 📋 STEP-BY-STEP INTEGRATION PROCESS

### Step 1: Copy Frontend Files
```bash
# Copy all files from the uploaded frontend to yumify-complete/frontend
cp -r messy-meals-managed-main/* yumify-complete/frontend/
cd yumify-complete/frontend
```

### Step 2: Install Additional Dependencies
```bash
npm install axios
```

### Step 3: Create API Client

Create `frontend/src/lib/apiClient.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🔄 CONTEXT MODIFICATIONS

### AuthContext.tsx Replacement

Replace `frontend/src/contexts/AuthContext.tsx` entirely with:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/apiClient';

export type UserRole = 'customer' | 'mess_manager' | null;

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  messId?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await apiClient.post('/auth/signup', { email, password, name });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = async () => {
    await apiClient.get('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  const setUserRole = async (role: UserRole) => {
    const response = await apiClient.put('/users/role', { role });
    setUser(response.data.user);
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        setUserRole,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### WalletContext.tsx Modifications

Replace wallet operations with API calls:

```typescript
// In WalletContext.tsx
import apiClient from '@/lib/apiClient';

// Replace all supabase calls with:

const fetchWalletData = async () => {
  try {
    const response = await apiClient.get('/wallet');
    setBalance(response.data.data.balance);
    setTransactions(response.data.data.transactions.map(tx => ({
      id: tx._id,
      type: tx.type === 'credit' ? 
        (tx.description.includes('Refund') ? 'refund' : 'add') : 
        (tx.description.includes('Withdrawn') ? 'withdraw' : 'payment'),
      description: tx.description,
      amount: tx.type === 'credit' ? tx.amount : -tx.amount,
      date: new Date(tx.createdAt).toLocaleDateString('en-CA'),
      time: new Date(tx.createdAt).toLocaleTimeString('en-US', { 
        hour: 'numeric', minute: '2-digit', hour12: true 
      }),
      orderId: tx.referenceId
    })));
  } catch (error) {
    console.error('Error fetching wallet:', error);
  } finally {
    setIsLoading(false);
  }
};

const addMoney = async (amount: number): Promise<boolean> => {
  try {
    await apiClient.post('/wallet/add', { amount });
    await fetchWalletData();
    toast.success(`₹${amount} added to wallet!`);
    return true;
  } catch (error) {
    toast.error('Failed to add money');
    return false;
  }
};

const makePayment = async (
  amount: number, 
  description: string, 
  messName?: string, 
  orderId?: string
): Promise<boolean> => {
  // This happens automatically when order is created
  // Just refresh wallet after order creation
  await fetchWalletData();
  return true;
};
```

### AppDataContext.tsx Modifications

Replace order operations:

```typescript
// In AppDataContext.tsx
import apiClient from '@/lib/apiClient';

const fetchOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    const orders = response.data.data.map(order => ({
      id: order._id,
      messId: order.mess._id,
      messName: order.mess.name,
      meal: order.meals.map(m => m.type).join(', '),
      meals: order.meals,
      date: new Date(order.orderDate).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'short', year: 'numeric' 
      }),
      time: new Date(order.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', minute: '2-digit' 
      }),
      day: new Date(order.orderDate).toLocaleDateString('en-IN', { 
        weekday: 'long' 
      }),
      amount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod
    }));
    setOrders(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    setIsLoadingOrders(false);
  }
};

const addOrder = async (order: Omit<OrderItem, 'id'>, messIdDb?: string): Promise<string | null> => {
  try {
    const response = await apiClient.post('/orders', {
      messId: messIdDb || order.messId,
      meals: order.meals,
      orderDate: new Date(),
      totalAmount: order.amount,
      paymentMethod: order.paymentMethod
    });
    
    await fetchOrders(); // Refresh orders
    return response.data.data._id;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to create order');
    return null;
  }
};
```

---

## 📄 KEY PAGES TO MODIFY

### 1. MessDetails.tsx

Replace mess fetching logic:

```typescript
// Remove hardcoded messesData
// Add API call:

const [mess, setMess] = useState<MessData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchMess = async () => {
    try {
      const response = await apiClient.get(`/messes/${id}`);
      const data = response.data.data;
      setMess({
        id: data._id,
        name: data.name,
        rating: data.rating.average,
        reviews: data.rating.count,
        cuisineType: data.cuisineType,
        // ... map all fields
        weeklyMenu: data.menu || []
      });
    } catch (error) {
      toast.error('Mess not found');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };
  
  fetchMess();
}, [id]);
```

### 2. CustomerHome.tsx

Replace mess listing:

```typescript
const [messes, setMesses] = useState([]);

useEffect(() => {
  const fetchMesses = async () => {
    try {
      const response = await apiClient.get('/messes');
      setMesses(response.data.data.map(m => ({
        id: m._id,
        name: m.name,
        rating: m.rating.average,
        reviews: m.rating.count,
        // ... map fields
      })));
    } catch (error) {
      console.error('Error fetching messes:', error);
    }
  };
  
  fetchMesses();
}, []);
```

### 3. Dashboard.tsx (Manager)

Fetch own mess:

```typescript
useEffect(() => {
  const fetchMyMess = async () => {
    try {
      const response = await apiClient.get('/messes/my/mess');
      setMess(response.data.data);
    } catch (error) {
      console.error('Error fetching mess:', error);
    }
  };
  
  fetchMyMess();
}, []);
```

---

## 🗑️ FILES TO DELETE

Remove Supabase-specific files:

```bash
rm -rf frontend/src/integrations/supabase
rm -rf frontend/supabase
```

---

## 📦 UPDATE package.json

Remove Supabase dependency:

```json
{
  "dependencies": {
    // Remove this line:
    // "@supabase/supabase-js": "^2.90.1",
    
    // Add this:
    "axios": "^1.6.2"
  }
}
```

---

## 🔧 ENVIRONMENT CONFIGURATION

Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

Update apiClient.ts to use it:

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  // ...
});
```

---

## ✅ TESTING CHECKLIST

After integration:

- [ ] User can signup
- [ ] User can login
- [ ] User can select role
- [ ] Customer can view messes
- [ ] Customer can view mess details and menu
- [ ] Customer can place order
- [ ] Order deducts from wallet
- [ ] Order appears in order history
- [ ] Mess manager can view their mess
- [ ] Mess manager can update menu
- [ ] Mess manager can view orders
- [ ] Wallet add money works
- [ ] Wallet transactions show correctly
- [ ] Receipt download works
- [ ] Dark mode works
- [ ] Logout works

---

## 🚨 COMMON ISSUES AND FIXES

### Issue: CORS Error
**Solution**: Backend already has CORS enabled. Ensure CORS_ORIGIN in backend .env matches frontend URL.

### Issue: 401 Unauthorized
**Solution**: Check if token is being sent in Authorization header. Clear localStorage and login again.

### Issue: Mess not found
**Solution**: Ensure mess ID from URL matches MongoDB ObjectId format. Use mess._id not mess.id.

### Issue: Orders not showing
**Solution**: Check if orders are being fetched with correct API endpoint. Verify token is valid.

---

## 📚 API INTEGRATION PATTERN

For ALL pages that fetch data, follow this pattern:

```typescript
import apiClient from '@/lib/apiClient';

const Component = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/endpoint');
        setData(response.data.data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <LoadingScreen />;

  return <div>{/* render data */}</div>;
};
```

---

## 🎯 FINAL STEPS

1. **Remove Supabase**: Delete all Supabase files and dependencies
2. **Install Axios**: `npm install axios`
3. **Create API Client**: Add apiClient.ts as shown above
4. **Update Contexts**: Replace all three contexts (Auth, Wallet, AppData)
5. **Update Pages**: Modify MessDetails, CustomerHome, Dashboard, Orders, etc.
6. **Test Everything**: Go through complete user flows
7. **Fix Issues**: Debug any remaining problems

---

**Remember**: Every place that imports from `@/integrations/supabase/client` needs to be changed to use `apiClient` instead.

Good luck with the integration! 🚀
