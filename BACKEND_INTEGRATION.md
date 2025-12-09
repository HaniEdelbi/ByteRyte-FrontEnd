# Backend Integration Guide

## 🔗 Connecting Frontend to Backend

This guide explains how to connect the ByteRyte frontend to your backend API.

## 📁 File Structure

```
src/
├── lib/
│   └── api.ts                 # Core API client and configuration
├── services/
│   ├── authService.ts         # Authentication API calls
│   └── passwordService.ts     # Password vault API calls
├── hooks/
│   ├── useAuth.ts            # React Query hooks for auth
│   └── usePasswords.ts       # React Query hooks for passwords
└── components/
    └── examples/             # Example usage components
```

## 🚀 Quick Start

### 1. Configure Backend URL

Create a `.env.local` file in the project root:

```bash
VITE_API_URL=http://localhost:3000/api
```

**Important:** Never commit `.env.local` to git. Use `.env.example` as a template.

### 2. Update API Base URL

The API configuration automatically reads from `VITE_API_URL` environment variable.

For production, create `.env.production`:
```bash
VITE_API_URL=https://api.byteryte.com/api
```

## 📝 Usage Examples

### Authentication

```typescript
import { useLogin, useRegister, useLogout } from '@/hooks/useAuth';

function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (email: string, password: string) => {
    login({ email, password }, {
      onSuccess: () => {
        console.log('Logged in successfully!');
      }
    });
  };
}
```

### Fetching Data

```typescript
import { usePasswords } from '@/hooks/usePasswords';

function PasswordList() {
  const { data, isLoading, error } = usePasswords();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(password => (
        <div key={password.id}>{password.title}</div>
      ))}
    </div>
  );
}
```

### Creating/Updating Data

```typescript
import { useCreatePassword, useUpdatePassword } from '@/hooks/usePasswords';

function PasswordForm() {
  const { mutate: createPassword } = useCreatePassword();
  const { mutate: updatePassword } = useUpdatePassword();

  const handleCreate = () => {
    createPassword({
      title: 'Google',
      username: 'user@example.com',
      password: 'securepassword123',
      url: 'https://google.com'
    });
  };

  const handleUpdate = (id: string) => {
    updatePassword({
      id,
      data: { title: 'Updated Title' }
    });
  };
}
```

## 🔐 Authentication Flow

1. **Login/Register**: Token is automatically stored in localStorage
2. **Authenticated Requests**: Token is automatically added to headers
3. **Logout**: Token is removed from localStorage

## 🛠️ API Client Features

### Automatic Token Management
```typescript
import { auth } from '@/lib/api';

// Set token (done automatically after login)
auth.setToken('your-jwt-token');

// Get token
const token = auth.getToken();

// Remove token
auth.removeToken();
```

### Direct API Calls (without React Query)
```typescript
import api from '@/lib/api';

// GET request
const data = await api.get('/endpoint');

// POST request
const result = await api.post('/endpoint', { data });

// PUT request
await api.put('/endpoint/:id', { data });

// DELETE request
await api.delete('/endpoint/:id');
```

### Error Handling
```typescript
import { APIError } from '@/lib/api';

try {
  await api.get('/endpoint');
} catch (error) {
  if (error instanceof APIError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('Data:', error.data);
  }
}
```

## 🎯 Backend Requirements

Your backend should:

1. **Accept JSON requests** with `Content-Type: application/json`
2. **Return JSON responses**
3. **Use Bearer token authentication**:
   ```
   Authorization: Bearer <token>
   ```
4. **Handle CORS** (allow requests from your frontend domain)
5. **Follow RESTful conventions**

### Example Backend Endpoints

```
POST   /api/auth/login          - Login user
POST   /api/auth/register       - Register user
POST   /api/auth/logout         - Logout user
GET    /api/auth/me            - Get current user

GET    /api/passwords          - Get all passwords
GET    /api/passwords/:id      - Get single password
POST   /api/passwords          - Create password
PATCH  /api/passwords/:id      - Update password
DELETE /api/passwords/:id      - Delete password
```

## 🔒 CORS Configuration

Your backend needs to allow requests from your frontend:

**Node.js/Express Example:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:8080', // Your Vite dev server
  credentials: true
}));
```

**Production:**
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

## 📊 React Query Configuration

React Query is already configured in `App.tsx`:

```typescript
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  {/* Your app */}
</QueryClientProvider>
```

## 🧪 Testing the Connection

1. Start your backend server
2. Update `.env.local` with the correct URL
3. Use the example components in `src/components/examples/`
4. Check browser DevTools Network tab for API calls

## 🚨 Troubleshooting

### CORS Errors
- Ensure your backend has CORS properly configured
- Check that the `origin` matches your frontend URL

### 401 Unauthorized
- Check if token is being sent in headers
- Verify token hasn't expired
- Ensure backend authentication middleware is correct

### Network Errors
- Verify backend is running
- Check the API URL in `.env.local`
- Ensure no typos in endpoint paths

## 📚 Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JWT Authentication](https://jwt.io/introduction)

## 🎨 Customization

### Add New API Services

1. Create service file in `src/services/`
2. Define TypeScript interfaces
3. Create functions using the `api` client
4. Create React Query hooks in `src/hooks/`
5. Use hooks in your components

### Modify API Client

Edit `src/lib/api.ts` to:
- Add custom headers
- Modify error handling
- Add request/response interceptors
- Change timeout settings
