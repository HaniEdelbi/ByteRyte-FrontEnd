# Examples

This folder contains example implementations of ByteRyte features. These components demonstrate how to integrate with the backend API and use the authentication and password management hooks.

## 📝 Available Examples

### `LoginExample.tsx`

Demonstrates user authentication with the backend API.

**Features:**
- Login and registration forms
- Form validation
- Error handling
- Loading states
- Token management

**Usage:**
```tsx
import LoginExample from '@/components/examples/LoginExample';

// In your page component
<LoginExample />
```

### `PasswordListExample.tsx`

Demonstrates password vault management functionality.

**Features:**
- Fetching passwords from the backend
- Adding new passwords
- Updating existing passwords
- Deleting passwords
- Loading and error states

**Usage:**
```tsx
import PasswordListExample from '@/components/examples/PasswordListExample';

// In your page component
<PasswordListExample />
```

## 🚀 Getting Started

1. **Set up the backend:** Follow the instructions in `BACKEND_INTEGRATION.md`

2. **Configure environment:** Update `.env.local` with your backend URL:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Import and use:**
   ```tsx
   import LoginExample from '@/components/examples/LoginExample';
   import PasswordListExample from '@/components/examples/PasswordListExample';
   ```

## 📚 Related Documentation

- [Backend Integration Guide](../../BACKEND_INTEGRATION.md)
- [Authentication Hook](../../hooks/useAuth.ts)
- [Password Management Hook](../../hooks/usePasswords.ts)
- [API Client](../../lib/api.ts)

## 💡 Tips

- These examples are meant for **development and testing**
- **Do not use** in production without proper security review
- **Customize** the UI to match your design system
- **Add validation** appropriate for your use case
- **Handle errors** based on your UX requirements

## 🔧 Customization

Feel free to:
- Modify the UI components
- Add additional form fields
- Customize validation logic
- Add more features (e.g., password strength indicator)
- Integrate with your state management solution

## 🐛 Troubleshooting

**Backend connection issues:**
- Verify `VITE_API_URL` is correct in `.env.local`
- Check that the backend server is running
- Ensure CORS is properly configured on the backend

**Authentication errors:**
- Check token storage in localStorage
- Verify JWT expiration settings
- Ensure backend authentication endpoints are working

**Data fetching issues:**
- Check TanStack Query DevTools for query state
- Verify API endpoints match backend routes
- Check network requests in browser DevTools
