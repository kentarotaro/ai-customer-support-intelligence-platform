# Frontend (Web) - Customer Support Intelligence Platform

## Overview

This is the frontend application for the AI Customer Support Intelligence Platform, built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/). It provides a modern, responsive UI for customer support agents and admins to manage conversations, view analytics, and interact with AI-powered features.

## Folder Structure

- **src/app/**: Main application pages, organized by route.
  - `layout.tsx`: Root layout for the app.
  - `page.tsx`: Home page.
  - Subfolders for each route (e.g., `/inbox`, `/login`, `/register`, `/settings`, `/analytics`, `/agentslist`, `/help`).
  - Dynamic routes (e.g., `/inbox/[id]`) for message details.
- **src/components/**: Reusable UI components.
  - `auth/`: Authentication-related components (e.g., `ProtectedRoute.tsx`).
  - `elements/`, `icons/`, `layout/`, `ui/`: UI building blocks (badges, tags, sidebar, icons, etc.).
  - `inbox/`: Components for the inbox and message details (AI suggestions, summaries, message lists).
- **src/context/**: React context providers for authentication and theming.
- **src/lib/**: Utility libraries (e.g., `api.ts` for API calls).
- **src/modules/**: (Reserved for future business logic modules.)
- **src/styles/**: Global and component-specific styles (Tailwind CSS).
- **src/types/**: TypeScript type definitions.
- **public/**: Static assets (images, icons, etc.).

## Key Features

- **Authentication**: Login and registration pages, protected routes using React context.
- **Inbox**: View and manage customer messages, with AI-powered response suggestions and summaries.
- **Analytics**: Visualize support metrics and agent performance.
- **Settings**: User profile and application settings.
- **Agents List**: View all support agents.
- **Help**: Access help and documentation.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.
- **API Integration**: Communicates with the backend API for data and AI features via `src/lib/api.ts`.

## Technologies Used

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/) for linting

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Customization

- **Add new pages:** Create a new folder in `src/app/` with a `page.tsx` file.
- **Add new components:** Place reusable components in `src/components/`.
- **API calls:** Use or extend `src/lib/api.ts` for backend communication.
- **Styling:** Use Tailwind CSS classes or add styles in `src/styles/globals.css`.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them.
4. Open a pull request.

## License

See the root `LICENSE` file for details.

---

For more information, see the [README.md](../../README.md) in the project root.
