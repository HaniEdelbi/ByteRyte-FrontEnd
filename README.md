# ByteRyte - Zero-Knowledge Password Wallet

> A modern, secure password management solution with military-grade encryption and zero-knowledge architecture.

![ByteRyte Dashboard](public/byteryte-uploads/dashboard-preview.png)

## 🔐 About ByteRyte

ByteRyte is a high-security password wallet application designed with privacy and security at its core. Your sensitive data is encrypted on your device before it ever reaches our servers - even we can't access your passwords.

### Key Features

- **🔒 Zero-Knowledge Architecture** - Your passwords are encrypted before they leave your device
- **🛡️ AES-256 Encryption** - Military-grade encryption protects all your sensitive information
- **🔑 Password Generator** - Create strong, unique passwords with customizable parameters
- **⚡ Auto-Fill Integration** - Seamlessly fill credentials across websites and applications
- **🔄 Cross-Platform Sync** - Access your vault from any device with end-to-end encryption
- **🚨 Breach Monitoring** - Get alerted if your credentials are found in known data breaches
- **👥 Secure Sharing** - Share passwords safely with family members or team members
- **🆘 Emergency Access** - Designate trusted contacts for emergency vault access

## 🚀 Tech Stack

ByteRyte is built using modern web technologies:

- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe code for better developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Radix UI** - Accessible, unstyled component primitives
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data fetching and state management
- **Lucide React** - Beautiful, consistent icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HaniEdelbi/ByteRyte-FrontEnd.git
   cd ByteRyte-FrontEnd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your backend API URL:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
ByteRyte-FrontEnd/
├── public/             # Static assets
│   ├── favicon.svg
│   └── byteryte-uploads/
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── examples/   # Example implementations
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and API client
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Application entry point
├── ARCHITECTURE.md     # Architecture documentation
├── BACKEND_INTEGRATION.md  # Backend setup guide
├── CONTRIBUTING.md     # Contributing guidelines
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 📚 Documentation

- **[Architecture Guide](ARCHITECTURE.md)** - Technical architecture and design patterns
- **[Backend Integration](BACKEND_INTEGRATION.md)** - How to connect to the backend API
- **[Contributing Guide](CONTRIBUTING.md)** - Guidelines for contributors

## 🎨 Customization

### Theme Configuration

Customize colors and design tokens in `src/index.css`:

```css
:root {
  --primary: 200 90% 40%;
  --accent: 165 80% 40%;
  /* ... */
}
```

### Tailwind Configuration

Extend Tailwind in `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
    },
  },
}
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Deployment Platforms

**Vercel** (Recommended)
```bash
npm run build
# Deploy the 'dist' folder to Vercel
```

**Netlify**
```bash
npm run build
# Deploy the 'dist' folder to Netlify
```

**GitHub Pages**
1. Update `vite.config.ts` with your base path
2. Run `npm run build`
3. Deploy the `dist` folder

**Custom Domain Configuration:**
- **Vercel**: Add your domain in the project settings
- **Netlify**: Configure custom domain in site settings
- **GitHub Pages**: Use a CNAME file for custom domain

## 🔒 Security

ByteRyte takes security seriously:

- ✅ All sensitive data is encrypted client-side before transmission
- ✅ Zero-knowledge architecture ensures only you can access your data
- ✅ No plaintext passwords are ever stored or transmitted
- ✅ Regular security audits and updates
- ✅ Open-source for transparency and community review

**Security Best Practices:**
- Always use HTTPS in production
- Keep dependencies updated
- Never commit `.env.local` or secrets to Git
- Review the [Security Guide](ARCHITECTURE.md#security-considerations)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

**Quick Start:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🐛 Troubleshooting

**Development server won't start:**
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Check if port 8080 is already in use

**Backend connection issues:**
- Verify `VITE_API_URL` in `.env.local`
- Check backend server is running
- Review [Backend Integration Guide](BACKEND_INTEGRATION.md)

**Build errors:**
- Run `npm run lint` to check for errors
- Ensure all dependencies are installed
- Check TypeScript errors with `tsc --noEmit`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Hani Edelbi**

- GitHub: [@HaniEdelbi](https://github.com/HaniEdelbi)
- Repository: [ByteRyte-FrontEnd](https://github.com/HaniEdelbi/ByteRyte-FrontEnd)

## 🙏 Acknowledgments

- UI Components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by modern password management solutions

## ⚠️ Important Notes

- This is the **frontend** application. You need a backend server for full functionality.
- See [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for backend setup instructions.
- For production use, ensure proper security measures are implemented on both frontend and backend.
- Never store sensitive data in localStorage without encryption.

---

**Built with ❤️ for security and privacy**
