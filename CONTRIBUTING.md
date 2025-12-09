# Contributing to ByteRyte Frontend

Thank you for your interest in contributing to ByteRyte! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Project Structure](#project-structure)
- [Component Guidelines](#component-guidelines)
- [Commit Guidelines](#commit-guidelines)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Maintain a professional and collaborative environment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ByteRyte-FrontEnd.git
   cd ByteRyte-FrontEnd
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 💻 Development Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code style guidelines

3. **Test your changes:**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes:**
   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 🎨 Code Style Guidelines

### TypeScript/React

- Use **TypeScript** for all new files
- Use **functional components** with hooks
- Use **arrow functions** for components
- Prefer **const** over let
- Use **descriptive variable names**
- Add **JSDoc comments** for complex functions
- Keep components **small and focused**

### Styling

- Use **Tailwind CSS** utility classes
- Follow the existing design system
- Use the **cn()** utility from `lib/utils.ts` for conditional classes
- Maintain responsive design with mobile-first approach
- Use CSS variables from `index.css` for colors

### File Organization

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── examples/       # Example implementations
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── lib/                # Utility functions
└── index.css           # Global styles
```

### Naming Conventions

- **Components:** PascalCase (`FeatureCard.tsx`)
- **Hooks:** camelCase with 'use' prefix (`useAuth.ts`)
- **Utils:** camelCase (`utils.ts`)
- **Services:** camelCase with Service suffix (`authService.ts`)
- **CSS classes:** kebab-case or Tailwind utilities

## 📁 Project Structure

### Key Directories

- **`src/components/`** - All React components
  - `ui/` - Reusable UI components (buttons, cards, etc.)
  - `examples/` - Example implementations for documentation
  
- **`src/pages/`** - Page-level components (Index, NotFound)

- **`src/hooks/`** - Custom React hooks for state and logic

- **`src/services/`** - API integration and backend communication

- **`src/lib/`** - Utility functions and helpers

- **`public/`** - Static assets (images, icons)

## 🧩 Component Guidelines

### Creating New Components

1. **Keep components small** - One responsibility per component
2. **Extract reusable logic** into custom hooks
3. **Use TypeScript interfaces** for props
4. **Add prop types** and default values
5. **Document complex components** with comments

### Example Component Structure

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  description?: string;
  className?: string;
}

const MyComponent = ({ title, description, className }: MyComponentProps) => {
  return (
    <div className={cn("base-classes", className)}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};

export default MyComponent;
```

### State Management

- Use **useState** for local component state
- Use **TanStack Query** for server state
- Keep state as close to where it's used as possible

### Performance

- Use **React.memo** for expensive components
- Use **useCallback** for callback functions passed to children
- Use **useMemo** for expensive calculations
- Lazy load components when appropriate

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Examples

```bash
feat: add password strength indicator
fix: resolve login form validation issue
docs: update API integration guide
style: format code with prettier
refactor: simplify authentication logic
perf: optimize image loading
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description:** Clear description of the issue
2. **Steps to reproduce:** Detailed steps to reproduce the bug
3. **Expected behavior:** What should happen
4. **Actual behavior:** What actually happens
5. **Screenshots:** If applicable
6. **Environment:** Browser, OS, Node version

## 💡 Feature Requests

When requesting features:

1. **Use case:** Explain why this feature is needed
2. **Proposed solution:** Describe how it should work
3. **Alternatives:** Other solutions you've considered
4. **Additional context:** Any other relevant information

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

## ❓ Questions?

If you have questions, feel free to:

- Open a GitHub Issue
- Check existing documentation
- Review closed issues for similar questions

Thank you for contributing to ByteRyte! 🎉
