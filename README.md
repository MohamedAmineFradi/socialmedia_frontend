# Social Media Frontend

A modern, modular, and secure frontend for a social media application, built with Next.js 15, React, Tailwind CSS, and Keycloak authentication. Designed for extensibility, maintainability, and seamless integration with the backend API.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Security & Authentication](#security--authentication)
- [API Integration](#api-integration)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Extensibility & Best Practices](#extensibility--best-practices)
- [Learn More](#learn-more)

---

## Features
- User authentication (Keycloak, OAuth2/OIDC, PKCE, silent SSO)
- Responsive UI with Tailwind CSS
- Modular, feature-based component structure
- CRUD for posts, comments, reactions, and profiles
- Real-time notifications and chat (if backend supports)
- API consumption from a secure Spring Boot backend
- Modern UX: modals, animations, mobile-ready
- Role-based UI (superAdmin, user)

---

## Architecture
- **Next.js 15 / React 18 / Node 22**
- **Tailwind CSS** for rapid, consistent styling
- **Feature/domain-based component organization** for maximum modularity
- **Hooks**: useState, useEffect, custom hooks for auth, posts, notifications, etc.
- **State management**: Local state (hooks), Zustand or Context API for auth/session
- **API layer**: All backend calls via a centralized service (see `src/services/`)
- **Authentication**: Keycloak JS adapter, SSR-safe, token refresh, role sync

---

## Security & Authentication
- **Keycloak**: Handles login, logout, token refresh, and role management
- **PKCE**: Secure OAuth2 flow for SPAs
- **Silent SSO**: Seamless user experience
- **Role-based UI**: Only show admin features to superAdmin users
- **Secure API calls**: All requests include JWT in Authorization header

---

## API Integration
- **Backend**: Connects to the Spring Boot API (see backend README for endpoints)
- **Swagger**: Use backend Swagger UI for API exploration
- **Error handling**: Graceful error messages, loading states, and retry logic
- **User/Session sync**: After login, fetch user info from `/api/users/me` to get roles and stats

---

## Directory Structure

The `src/components` directory is organized by feature/domain for maximum modularity and maintainability. Each folder contains all UI and logic for that domain. Only truly generic UI elements are in `ui/`, and layouts are in `layouts/`.

```
components/
  ui/                # Pure, reusable UI atoms/molecules (Button, Footer, Logo, etc.)
  layouts/           # Page or section layouts (MainLayout, etc.)
  posts/             # All post and comment-related components
  profile/           # Profile page, header, stats, sidebar, etc.
  sidebar/           # Sidebars (WhoToFollow, RightSidebar, etc.)
  nav/               # Navigation (Navigation.js, IconRail.js, etc.)
  notifications/     # Notification drawer, notification item, etc.
  chat/              # Messaging/DM drawer, chat bubbles, etc.
  forms/             # Generic, reusable form components (if any)
```

**Guidelines:**
- Group by feature/domain, not by type.
- Encapsulate all feature UI/logic in its folder.
- Only generic UI in `ui/`.
- No cross-feature imports except through `ui/` or `layouts/`.

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the app.
4. Configure Keycloak and backend API URLs in your environment variables if needed.

---

## Extensibility & Best Practices
- **Modular**: Add new features by creating new folders in `components/` and `services/`
- **SOLID**: Keep logic and UI separated, use hooks for business logic
- **Type safety**: Use TypeScript for new code if possible
- **Testing**: Add unit and integration tests for components and hooks
- **Accessibility**: Use semantic HTML and ARIA attributes
- **Performance**: Use React.memo, lazy loading, and code splitting
- **Security**: Never expose secrets in the frontend, always validate JWTs on the backend

---

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Keycloak JS Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [React](https://react.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) (if used)
- [Material UI](https://mui.com/) / [Flowbite](https://flowbite-react.com/) for UI components

---

**This frontend is production-ready, modular, and easy to extend for mobile, admin, or new social features.**
