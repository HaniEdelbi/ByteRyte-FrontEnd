# 🔐 ByteRyte - Zero-Knowledge Password Manager# ByteRyte - Zero-Knowledge Password Wallet



<div align="center">> A modern, secure password management solution with military-grade encryption and zero-knowledge architecture.



![ByteRyte Logo](public/logo.svg)![ByteRyte Dashboard](public/byteryte-uploads/dashboard-preview.png)



**A modern, secure password management solution with military-grade encryption and zero-knowledge architecture.**## 🔐 About ByteRyte



[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://reactjs.org/)ByteRyte is a high-security password wallet application designed with privacy and security at its core. Your sensitive data is encrypted on your device before it ever reaches our servers - even we can't access your passwords.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6?logo=typescript)](https://www.typescriptlang.org/)

[![Vite](https://img.shields.io/badge/Vite-5.4.1-646cff?logo=vite)](https://vitejs.dev/)### Key Features

[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

- **🔒 Zero-Knowledge Architecture** - Your passwords are encrypted before they leave your device

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [API Integration](#-api-integration)- **🛡️ AES-256 Encryption** - Military-grade encryption protects all your sensitive information

- **🔑 Password Generator** - Create strong, unique passwords with customizable parameters

</div>- **⚡ Auto-Fill Integration** - Seamlessly fill credentials across websites and applications

- **🔄 Cross-Platform Sync** - Access your vault from any device with end-to-end encryption

---- **🚨 Breach Monitoring** - Get alerted if your credentials are found in known data breaches

- **👥 Secure Sharing** - Share passwords safely with family members or team members

## 📖 Table of Contents- **🆘 Emergency Access** - Designate trusted contacts for emergency vault access



- [About ByteRyte](#-about-byteryte)## 🚀 Tech Stack

- [Key Features](#-key-features)

- [Tech Stack](#-tech-stack)ByteRyte is built using modern web technologies:

- [Quick Start](#-quick-start)

- [Project Structure](#-project-structure)- **React 18** - Modern UI library with hooks and concurrent features

- [Architecture](#-architecture)- **TypeScript** - Type-safe code for better developer experience

- [API Integration](#-api-integration)- **Vite** - Lightning-fast build tool and dev server

- [Network Access](#-network-access-configuration)- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

- [Available Scripts](#-available-scripts)- **Radix UI** - Accessible, unstyled component primitives

- [Environment Variables](#-environment-variables)- **React Router** - Client-side routing

- [Contributing](#-contributing)- **TanStack Query** - Powerful data fetching and state management

- [Security](#-security)- **Lucide React** - Beautiful, consistent icons

- [License](#-license)

## 📋 Prerequisites

---

Before you begin, ensure you have the following installed:

## 🛡️ About ByteRyte

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)

ByteRyte is a high-security password wallet application designed with **privacy and security at its core**. Your sensitive data is encrypted on your device before it ever reaches our servers - **even we can't access your passwords**.- **npm** or **yarn** - Comes with Node.js



### Why ByteRyte?## 🛠️ Installation



- **Zero-Knowledge Architecture** - All encryption happens client-side1. **Clone the repository**

- **Open Source** - Transparent, auditable codebase

- **Modern Stack** - Built with the latest web technologies   ```bash

- **Cross-Platform** - Access from any device with end-to-end encryption   git clone https://github.com/HaniEdelbi/ByteRyte-FrontEnd.git

- **Privacy First** - We never see your master password or decrypted data   cd ByteRyte-FrontEnd

   ```

---

2. **Install dependencies**

## ✨ Key Features

   ```bash

### 🔒 Security Features   npm install

- **Zero-Knowledge Encryption** - Your passwords are encrypted before leaving your device   ```

- **AES-256 Encryption** - Military-grade encryption for all sensitive data

- **Client-Side Hashing** - Password verifier never sent to server3. **Set up environment variables**

- **Device Management** - Monitor and control access from all devices

- **Session Management** - View and revoke active sessions   ```bash

   cp .env.example .env.local

### 🎯 Core Functionality   ```

- **Password Vault** - Securely store unlimited passwords

- **Categories & Organization** - Login, Payment, Secure Notes, and custom categories   Edit `.env.local` and add your backend API URL:

- **Favorites** - Quick access to frequently used passwords

- **Search & Filter** - Find passwords instantly   ```

- **Password Generator** - Create strong, unique passwords (coming soon)   VITE_API_URL=http://localhost:3000/api

- **Auto-Fill Integration** - Seamlessly fill credentials (coming soon)   ```



### 🌐 User Experience4. **Start the development server**

- **Modern UI/UX** - Clean, intuitive interface with glass-morphism design

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile   ```bash

- **Dark Mode Ready** - Eye-friendly theme support   npm run dev

- **Real-time Sync** - Changes reflected instantly across devices   ```

- **Offline Support** - Access cached data without internet (coming soon)

   The application will be available at `http://localhost:8080`

### 👥 Collaboration (Coming Soon)

- **Secure Sharing** - Share passwords safely with family or team## 📁 Project Structure

- **Emergency Access** - Designate trusted contacts for vault access

- **Breach Monitoring** - Get alerted for compromised credentials```

ByteRyte-FrontEnd/

---├── public/             # Static assets

│   ├── favicon.svg

## 🚀 Tech Stack│   └── byteryte-uploads/

├── src/

### Core Technologies│   ├── components/     # React components

| Technology | Version | Purpose |│   │   ├── ui/         # Reusable UI components

|------------|---------|---------|│   │   ├── examples/   # Example implementations

| **React** | 18.3.1 | UI library with hooks and concurrent features |│   │   ├── Features.tsx

| **TypeScript** | 5.5.3 | Type-safe JavaScript for better DX |│   │   ├── Hero.tsx

| **Vite** | 5.4.1 | Lightning-fast build tool and dev server |│   │   ├── Navbar.tsx

| **Tailwind CSS** | 3.4.11 | Utility-first CSS framework |│   │   └── ...

| **React Router** | 6.26.2 | Client-side routing |│   ├── hooks/          # Custom React hooks

│   ├── lib/            # Utility functions and API client

### State Management & Data Fetching│   ├── pages/          # Page components

- **TanStack Query** (5.56.2) - Server state management, caching, and synchronization│   ├── services/       # API services

- **React Hooks** - Local component state management│   ├── App.tsx         # Main app component

│   └── main.tsx        # Application entry point

### UI Components & Styling├── ARCHITECTURE.md     # Architecture documentation

- **Radix UI** - Accessible, unstyled component primitives├── BACKEND_INTEGRATION.md  # Backend setup guide

  - Toast/Notifications├── CONTRIBUTING.md     # Contributing guidelines

  - Tooltips├── index.html          # HTML template

  - Slots├── vite.config.ts      # Vite configuration

- **Lucide React** (0.462.0) - Beautiful, consistent icon library├── tailwind.config.ts  # Tailwind CSS configuration

- **Sonner** (1.5.0) - Toast notifications└── tsconfig.json       # TypeScript configuration

- **CVA** (Class Variance Authority) - Type-safe variant styling```

- **tailwind-merge** - Conditional class merging

- **tailwindcss-animate** - Animation utilities## 📚 Documentation



### Development Tools- **[Architecture Guide](ARCHITECTURE.md)** - Technical architecture and design patterns

- **ESLint** - Code linting- **[Backend Integration](BACKEND_INTEGRATION.md)** - How to connect to the backend API

- **TypeScript ESLint** - TypeScript-specific linting- **[Contributing Guide](CONTRIBUTING.md)** - Guidelines for contributors

- **PostCSS** - CSS processing

- **Autoprefixer** - CSS vendor prefixing## 🎨 Customization



---### Theme Configuration



## 🏁 Quick StartCustomize colors and design tokens in `src/index.css`:



### Prerequisites```css

:root {

Ensure you have the following installed:  --primary: 200 90% 40%;

- **Node.js** 18+ ([Download](https://nodejs.org/))  --accent: 165 80% 40%;

- **npm** or **yarn** (comes with Node.js)  /* ... */

- **Git** ([Download](https://git-scm.com/))}

```

### Installation

### Tailwind Configuration

1. **Clone the repository**

   ```bashExtend Tailwind in `tailwind.config.ts`:

   git clone https://github.com/HaniEdelbi/ByteRyte-FrontEnd.git

   cd ByteRyte-FrontEnd```typescript

   ```export default {

  theme: {

2. **Install dependencies**    extend: {

   ```bash      colors: {

   npm install        // Custom colors

   ```      },

    },

3. **Configure environment variables**  },

   ```bash}

   # Copy the example env file```

   cp .env.example .env.local

   ## 🚢 Deployment

   # Edit .env.local and set your API URL

   VITE_API_URL=http://localhost:3000/api### Build for Production

   ```

```bash

4. **Start the development server**npm run build

   ```bash```

   npm run dev

   ```The optimized production build will be in the `dist` folder.



5. **Open your browser**### Deployment Platforms

   

   Navigate to [http://localhost:5173](http://localhost:5173)**Vercel** (Recommended)

```bash

### Building for Productionnpm run build

# Deploy the 'dist' folder to Vercel

```bash```

# Build for production

npm run build**Netlify**

```bash

# Preview production buildnpm run build

npm run preview# Deploy the 'dist' folder to Netlify

``````



---**GitHub Pages**

1. Update `vite.config.ts` with your base path

## 📁 Project Structure2. Run `npm run build`

3. Deploy the `dist` folder

```

ByteRyte-FrontEnd/**Custom Domain Configuration:**

├── public/                          # Static assets- **Vercel**: Add your domain in the project settings

│   ├── favicon.svg                  # Site favicon- **Netlify**: Configure custom domain in site settings

│   ├── logo.svg                     # ByteRyte logo- **GitHub Pages**: Use a CNAME file for custom domain

│   └── lovable-uploads/             # User-uploaded images

│## 🔒 Security

├── src/

│   ├── components/                  # React componentsByteRyte takes security seriously:

│   │   ├── ui/                      # Reusable UI components (40+ components)

│   │   │   ├── button.tsx- ✅ All sensitive data is encrypted client-side before transmission

│   │   │   ├── card.tsx- ✅ Zero-knowledge architecture ensures only you can access your data

│   │   │   ├── input.tsx- ✅ No plaintext passwords are ever stored or transmitted

│   │   │   ├── dialog.tsx- ✅ Regular security audits and updates

│   │   │   └── ...- ✅ Open-source for transparency and community review

│   │   ├── Features.tsx             # Features showcase section

│   │   ├── Footer.tsx               # Site footer**Security Best Practices:**

│   │   ├── Hero.tsx                 # Landing page hero- Always use HTTPS in production

│   │   ├── Navbar.tsx               # Navigation bar- Keep dependencies updated

│   │   ├── Newsletter.tsx           # Newsletter signup- Never commit `.env.local` or secrets to Git

│   │   ├── PlatformShowcase.tsx     # Platform features- Review the [Security Guide](ARCHITECTURE.md#security-considerations)

│   │   ├── ProfileDropdown.tsx      # User profile menu

│   │   ├── ProtectedRoute.tsx       # Auth guard component## 🤝 Contributing

│   │   ├── SecurityLayers.tsx       # Security visualization

│   │   └── TrustMetrics.tsx         # Trust indicatorsWe welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

│   │

│   ├── hooks/                       # Custom React hooks**Quick Start:**

│   │   ├── useAuth.ts              # Authentication hooks1. Fork the repository

│   │   ├── usePasswords.ts         # Password CRUD hooks2. Create a feature branch (`git checkout -b feature/AmazingFeature`)

│   │   ├── useSession.ts           # Session/device management hooks3. Commit your changes (`git commit -m 'feat: add amazing feature'`)

│   │   ├── use-mobile.tsx          # Mobile detection hook4. Push to the branch (`git push origin feature/AmazingFeature`)

│   │   └── use-toast.ts            # Toast notification hook5. Open a Pull Request

│   │

│   ├── lib/                         # Utility librariesSee [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

│   │   ├── api.ts                  # API client & configuration

│   │   └── utils.ts                # Helper functions## 📜 Scripts

│   │

│   ├── pages/                       # Page components- `npm run dev` - Start development server

│   │   ├── Index.tsx               # Landing page- `npm run build` - Build for production

│   │   ├── Login.tsx               # Login/Register page- `npm run build:dev` - Build for development

│   │   ├── Vault.tsx               # Password vault dashboard- `npm run lint` - Run ESLint

│   │   ├── Settings.tsx            # User settings- `npm run preview` - Preview production build locally

│   │   ├── Profile.tsx             # User profile

│   │   ├── Sessions.tsx            # Device management## 🐛 Troubleshooting

│   │   ├── Pricing.tsx             # Pricing plans

│   │   ├── TestBackend.tsx         # API testing page (dev only)**Development server won't start:**

│   │   └── NotFound.tsx            # 404 page- Ensure Node.js 18+ is installed

│   │- Delete `node_modules` and run `npm install` again

│   ├── services/                    # API service layers- Check if port 8080 is already in use

│   │   ├── authService.ts          # Authentication API

│   │   ├── passwordService.ts      # Password vault API**Backend connection issues:**

│   │   └── sessionService.ts       # Session/device API- Verify `VITE_API_URL` in `.env.local`

│   │- Check backend server is running

│   ├── App.tsx                      # Main app component & routing- Review [Backend Integration Guide](BACKEND_INTEGRATION.md)

│   ├── main.tsx                     # App entry point

│   ├── index.css                    # Global styles**Build errors:**

│   └── vite-env.d.ts               # Vite type definitions- Run `npm run lint` to check for errors

│- Ensure all dependencies are installed

├── .env.example                     # Environment variables template- Check TypeScript errors with `tsc --noEmit`

├── .env.local                       # Local environment (not committed)

├── .gitignore                       # Git ignore rules## 📄 License

├── components.json                  # UI components config

├── eslint.config.js                 # ESLint configurationThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

├── index.html                       # HTML template

├── package.json                     # Dependencies & scripts## 👤 Author

├── postcss.config.js               # PostCSS configuration

├── tailwind.config.ts              # Tailwind CSS configuration**Hani Edelbi**

├── tsconfig.json                   # TypeScript configuration

├── tsconfig.app.json               # App-specific TS config- GitHub: [@HaniEdelbi](https://github.com/HaniEdelbi)

├── tsconfig.node.json              # Node-specific TS config- Repository: [ByteRyte-FrontEnd](https://github.com/HaniEdelbi/ByteRyte-FrontEnd)

├── vite.config.ts                  # Vite configuration

├── FRONTEND_SYNC_GUIDE.md          # Backend API integration guide## 🙏 Acknowledgments

├── SYNC_CHANGES_LOG.md             # Frontend-backend sync changelog

└── README.md                        # This file- UI Components from [Radix UI](https://www.radix-ui.com/)

```- Icons by [Lucide](https://lucide.dev/)

- Styled with [Tailwind CSS](https://tailwindcss.com/)

---- Inspired by modern password management solutions



## 🏗️ Architecture## ⚠️ Important Notes



### Design Patterns- This is the **frontend** application. You need a backend server for full functionality.

- See [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for backend setup instructions.

#### Component Architecture- For production use, ensure proper security measures are implemented on both frontend and backend.

- **Atomic Design** - Components organized from atoms to organisms- Never store sensitive data in localStorage without encryption.

- **Compound Components** - Related components work together

- **Render Props & Hooks** - Flexible component composition---

- **Higher-Order Components** - ProtectedRoute for auth guards

**Built with ❤️ for security and privacy**

#### State Management
- **Server State** - TanStack Query for API data (caching, background updates)
- **Local State** - React hooks for UI state
- **URL State** - React Router for navigation state

#### Code Organization
```
Feature-based structure:
- Component files co-located with related logic
- Service layer for API calls
- Custom hooks for reusable logic
- Type definitions inline with usage
```

### Routing Structure

```typescript
Public Routes:
  /              → Landing page (Index.tsx)
  /pricing       → Pricing plans
  /login         → Login/Register page
  /test          → Backend testing (dev only)

Protected Routes (require authentication):
  /vault         → Password vault dashboard
  /settings      → User settings
  /profile       → User profile & subscription
  /sessions      → Device management

Fallback:
  *              → 404 Not Found page
```

### Authentication Flow

```
1. User registers/logs in
   ↓
2. Client generates passwordVerifier (never sends plain password)
   ↓
3. Backend returns JWT token
   ↓
4. Token stored in localStorage
   ↓
5. Token sent with all API requests via Authorization header
   ↓
6. ProtectedRoute checks for valid token
   ↓
7. Redirects to /login if not authenticated
```

### Data Flow

```
Component → Hook → Service → API
    ↑                           ↓
    └─────── TanStack Query ────┘
         (caching, refetch, state)
```

---

## 🔌 API Integration

### Backend Requirements

The frontend expects a REST API with the following endpoints. See **[FRONTEND_SYNC_GUIDE.md](./FRONTEND_SYNC_GUIDE.md)** for complete specifications.

#### Authentication Endpoints
```typescript
POST   /api/auth/register      // Register new user
POST   /api/auth/login         // Login user
POST   /api/auth/logout        // Logout user
```

#### Vault Management
```typescript
GET    /api/vaults             // Get all vaults for user
```

#### Password Management
```typescript
GET    /api/passwords          // Get all passwords
POST   /api/passwords          // Create password
PUT    /api/passwords/:id      // Update password
DELETE /api/passwords/:id      // Delete password
```

#### Device Management
```typescript
GET    /api/devices            // Get all devices
DELETE /api/devices/:id        // Revoke device access
```

### API Configuration

The API client automatically detects the correct backend URL:

**Development:**
```javascript
// Accessing via localhost
Frontend: http://localhost:5173
Backend:  http://localhost:3000/api

// Accessing via IP address
Frontend: http://192.168.10.135:5173
Backend:  http://192.168.10.135:3000/api
```

**Production:**
Set `VITE_API_URL` in `.env.production`:
```bash
VITE_API_URL=https://api.yourdomain.com/api
```

### Request/Response Format

#### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

#### Standard Error Response
```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human-readable error message",
  "statusCode": 400
}
```

### Authentication Headers

All protected endpoints require:
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Data Models

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

#### Password
```typescript
interface Password {
  id: string;
  vaultId: string;
  encryptedBlob: string;     // Client-side encrypted
  category: 'login' | 'payment' | 'secure-note' | 'other';
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Device
```typescript
interface Device {
  id: string;
  name: string;
  fingerprint: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastSeen: string;
  createdAt: string;
  isCurrentDevice: boolean;
}
```

### Usage Examples

#### Authentication
```typescript
import { useLogin, useRegister } from '@/hooks/useAuth';

function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  
  const handleLogin = (email: string, password: string) => {
    login({ email, password }, {
      onSuccess: (data) => {
        console.log('Logged in:', data.user);
        // Token automatically stored
      },
      onError: (error) => {
        console.error('Login failed:', error.message);
      }
    });
  };
}
```

#### Password Management
```typescript
import { usePasswords, useCreatePassword } from '@/hooks/usePasswords';

function PasswordVault() {
  const { data: passwords, isLoading } = usePasswords();
  const { mutate: createPassword } = useCreatePassword();
  
  const handleCreate = () => {
    createPassword({
      vaultId: 'vault_id',
      encryptedBlob: 'encrypted_data',
      category: 'login',
      favorite: false
    });
  };
}
```

---

## 🌐 Network Access Configuration

### Accessing from Other Devices on Your Network

#### Frontend (Already Configured ✅)
The frontend automatically detects and uses the correct API URL based on how it's accessed.

#### Backend Configuration Required

**1. Listen on All Network Interfaces**

Make sure your backend listens on `0.0.0.0` instead of just `localhost`:

```javascript
// Node.js/Express example
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
```

**2. Configure CORS**

Allow requests from different origins:

```javascript
const cors = require('cors');

app.use(cors({
  origin: '*',  // For development (use specific origins in production)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**3. Firewall Configuration**

Ensure port 3000 is allowed:

```bash
# Windows Firewall
New-NetFirewallRule -DisplayName "ByteRyte API" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow

# Linux (ufw)
sudo ufw allow 3000/tcp

# macOS
# Add rule in System Preferences > Security & Privacy > Firewall > Options
```

**4. Find Your IP Address**

```bash
# Windows
ipconfig

# Linux/macOS
ifconfig
# or
ip addr show
```

### Testing Network Access

1. **Start your backend** on `0.0.0.0:3000`
2. **Start your frontend** with `npm run dev`
3. **From another device**, navigate to `http://<your-ip>:5173`
   - Example: `http://192.168.10.135:5173`
4. Frontend will automatically connect to `http://192.168.10.135:3000/api`

---

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run lint         # Run ESLint for code quality
```

### Production
```bash
npm run build        # Build for production (outputs to /dist)
npm run preview      # Preview production build locally
```

### Advanced
```bash
npm run build:dev    # Build in development mode (with source maps)
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Optional: Enable debug mode
VITE_DEBUG=true
```

### Available Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | Auto-detected | No |
| `VITE_DEBUG` | Enable debug logging | `false` | No |

**Important Notes:**
- ⚠️ Never commit `.env.local` to version control
- ✅ Use `.env.example` as a template
- 🔒 All `VITE_` prefixed variables are exposed to the client
- 🚫 Never store secrets in `VITE_` variables

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types for all new code
   - Keep components small and focused
   - Write meaningful commit messages

4. **Test your changes**
   ```bash
   npm run lint        # Check for linting errors
   npm run build       # Ensure it builds successfully
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**

### Code Style Guidelines

#### TypeScript
- ✅ Use TypeScript for all new files
- ✅ Define interfaces for props and data
- ✅ Avoid `any` - use proper types
- ✅ Use strict mode

#### React Components
- ✅ Functional components with hooks
- ✅ One component per file
- ✅ PascalCase for component names
- ✅ camelCase for functions and variables

#### File Naming
- ✅ Components: `PascalCase.tsx`
- ✅ Hooks: `useHookName.ts`
- ✅ Utils: `camelCase.ts`
- ✅ Pages: `PascalCase.tsx`

#### CSS/Styling
- ✅ Use Tailwind utility classes
- ✅ Extract common patterns to components
- ✅ Use `cn()` utility for conditional classes
- ✅ Avoid inline styles

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes (formatting, etc)
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Project-Specific Guidelines

#### Adding New Components
1. Create in appropriate directory (`components/` or `components/ui/`)
2. Export from the component file
3. Add TypeScript interfaces for props
4. Document complex components with JSDoc

#### Adding New Pages
1. Create in `src/pages/`
2. Add route in `App.tsx`
3. Use `ProtectedRoute` if authentication required
4. Update this README if adding new route

#### Adding New API Endpoints
1. Add service function in `src/services/`
2. Create custom hook in `src/hooks/`
3. Update type definitions
4. Test with backend

---

## 🔒 Security

### Zero-Knowledge Architecture

ByteRyte implements true zero-knowledge encryption:

1. **Client-Side Encryption**
   - All passwords encrypted before leaving your device
   - Master key never sent to server
   - Encryption key derived from master password

2. **Password Verifier**
   - Uses password-derived hash for authentication
   - Server never sees your actual password
   - Implements SRP-like protocol

3. **Device Fingerprinting**
   - Unique identifier for each device
   - Session management and monitoring
   - Ability to revoke device access

### Security Best Practices

**For Users:**
- ✅ Use a strong, unique master password
- ✅ Enable 2FA (when available)
- ✅ Regularly review active devices
- ✅ Revoke access from unused devices
- ✅ Keep your devices secure

**For Developers:**
- ✅ Never log sensitive data
- ✅ Always use HTTPS in production
- ✅ Sanitize user inputs
- ✅ Keep dependencies updated
- ✅ Follow OWASP guidelines

### Reporting Security Issues

🚨 **Do not open public issues for security vulnerabilities**

Email security concerns to: [security@byteryte.com](mailto:security@byteryte.com)

We take security seriously and will respond promptly to all reports.

---

## 📝 Documentation

### Main Documentation
- **[README.md](./README.md)** - This file (overview and setup)
- **[FRONTEND_SYNC_GUIDE.md](./FRONTEND_SYNC_GUIDE.md)** - Complete backend API specification
- **[SYNC_CHANGES_LOG.md](./SYNC_CHANGES_LOG.md)** - Frontend-backend synchronization changes

### Key Concepts

#### Protected Routes
Components wrapped in `<ProtectedRoute>` require authentication:
```typescript
<Route path="/vault" element={
  <ProtectedRoute>
    <Vault />
  </ProtectedRoute>
} />
```

#### API Client
Centralized API configuration with auto-detection:
```typescript
import api from '@/lib/api';

// Automatically adds Authorization header
const data = await api.get('/passwords');
```

#### TanStack Query
Server state management with caching:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['passwords'],
  queryFn: () => passwordService.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: API requests failing with CORS errors**
- ✅ Ensure backend has CORS configured
- ✅ Check `VITE_API_URL` is correct
- ✅ Verify backend is running on correct port

**Issue: "Unauthorized" errors on protected routes**
- ✅ Check if JWT token is valid
- ✅ Clear localStorage and login again
- ✅ Verify backend is accepting the token format

**Issue: Build fails with TypeScript errors**
- ✅ Run `npm install` to ensure dependencies are up to date
- ✅ Check for type mismatches in recent changes
- ✅ Delete `node_modules` and reinstall

**Issue: Hot reload not working**
- ✅ Check Vite dev server is running
- ✅ Clear browser cache
- ✅ Restart dev server

### Getting Help

- 📧 **Email:** support@byteryte.com
- 💬 **Discord:** [Join our community](https://discord.gg/byteryte)
- 🐛 **Issues:** [GitHub Issues](https://github.com/HaniEdelbi/ByteRyte-FrontEnd/issues)

---

## 📊 Project Status

### Current Status: **Beta** 🚧

### Completed Features ✅
- ✅ Landing page with features showcase
- ✅ User authentication (register/login/logout)
- ✅ Password vault dashboard
- ✅ Password CRUD operations
- ✅ Category and favorite support
- ✅ Device/session management
- ✅ User profile page
- ✅ Settings page
- ✅ Responsive design
- ✅ Protected routing
- ✅ API integration layer

### In Progress 🚧
- 🚧 Password encryption/decryption implementation
- 🚧 Password generator
- 🚧 Auto-fill functionality
- 🚧 Breach monitoring

### Planned Features 📋
- 📋 2FA implementation
- 📋 Password sharing
- 📋 Emergency access
- 📋 Offline mode
- 📋 Browser extensions
- 📋 Mobile apps (iOS/Android)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Frontend Lead:** Hani Edelbi  
**GitHub:** [@HaniEdelbi](https://github.com/HaniEdelbi)

---

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Lucide](https://lucide.dev/) - Beautiful icon library
- [TanStack Query](https://tanstack.com/query) - Powerful data fetching
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📞 Contact

- **Website:** [byteryte.com](https://byteryte.com)
- **Email:** [contact@byteryte.com](mailto:contact@byteryte.com)
- **GitHub:** [@HaniEdelbi](https://github.com/HaniEdelbi)

---

<div align="center">

**Made with ❤️ by the ByteRyte Team**

[⬆ Back to Top](#-byteryte---zero-knowledge-password-manager)

</div>
