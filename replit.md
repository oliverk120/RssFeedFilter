# RSS Feed Reader Application

## Overview

This application is an RSS feed reader that allows users to fetch and filter RSS feeds from provided URLs. The system is built with a modern web architecture using React for the frontend and Express.js for the backend, with Drizzle ORM for database management. The application follows a clean architecture pattern with clear separation between client and server components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a standard client-server architecture:

1. **Frontend**: React-based SPA (Single Page Application) using modern React patterns with hooks and functional components
2. **Backend**: Express.js server that handles API requests and data processing
3. **Database**: PostgreSQL database accessed through Drizzle ORM for data persistence
4. **UI Components**: Shadcn UI component library built on Radix UI primitives with a customized theme
5. **State Management**: React Query for server state management

### Key Architecture Decisions

- **Monorepo Structure**: The project uses a monorepo approach with client and server code in the same repository, allowing for shared types and schema definitions.
- **Type Safety**: TypeScript is used throughout the application for better type safety and developer experience.
- **API Design**: RESTful API design for simplicity and ease of use.
- **UI Component Library**: Using Shadcn UI (based on Radix UI) for accessible and customizable UI components.
- **Database Access**: Drizzle ORM with PostgreSQL for type-safe database access and schema management.
- **Server-Side Rendering**: Vite is used for development with support for server-side rendering.

## Key Components

### Frontend Components

1. **Main Application (App.tsx)**: The root component that sets up routing and global providers.
2. **Home Page (Home.tsx)**: The main page where users interact with RSS feeds.
3. **FeedInputForm**: Component for entering RSS feed URLs and filter keywords.
4. **FeedItemsList**: Component for displaying feed items with filtering support.
5. **FeedStatus**: Component for showing the current status of feed operations.
6. **UI Components**: A comprehensive set of UI components from Shadcn UI library.

### Backend Components

1. **Express Server (index.ts)**: The main server file that sets up middleware and routes.
2. **Routes (routes.ts)**: API routes definition for the application.
3. **Storage (storage.ts)**: Data storage layer that implements the repository pattern.
4. **Schema (schema.ts)**: Database schema definitions shared between frontend and backend.

### Data Models

1. **Feed Items**: Represents RSS feed entries with title, link, content, etc.
2. **Users**: Basic user model with username and password.

## Data Flow

1. **Feed Fetching**:
   - User enters an RSS feed URL and optional filter keywords
   - Frontend makes a request to the backend API
   - Backend fetches the RSS feed using `rss-parser`
   - Backend filters results if keywords are provided
   - Results are returned to the frontend and displayed

2. **Data Persistence**:
   - Feed items can be stored in the database using the defined schema
   - Users can be created and authenticated (authentication appears to be partially implemented)

## External Dependencies

### Frontend Dependencies

- React for UI rendering
- React Query for data fetching and caching
- Shadcn UI / Radix UI for UI components
- TailwindCSS for styling
- Wouter for routing
- Lucide React for icons

### Backend Dependencies

- Express.js for API server
- Drizzle ORM for database access
- RSS Parser for fetching and parsing RSS feeds
- Zod for schema validation

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**:
   - Frontend is built using Vite
   - Backend is bundled using esbuild
   - The complete application is packaged into a single deployable unit

2. **Runtime Environment**:
   - Node.js 20 for server runtime
   - PostgreSQL 16 for database
   - Web server for frontend serving

3. **Environment Configuration**:
   - Development mode with `npm run dev`
   - Production mode with `npm run build` and `npm run start`
   - Database URL configured through environment variables

4. **Ports and Services**:
   - The application runs on port 5000
   - External access is provided through port 80

## Development Workflow

1. Run the development server: `npm run dev`
2. Build for production: `npm run build`
3. Start production server: `npm run start`
4. Update database schema: `npm run db:push`

## Database Management

- Drizzle ORM is used for database access with a PostgreSQL backend
- Schema is defined in `shared/schema.ts`
- Migration commands are available through `drizzle-kit`
- In-memory storage fallback is implemented for development purposes

## Future Enhancements

1. Complete the authentication system
2. Add user-specific feed subscriptions
3. Implement feed categorization and organization
4. Add notification system for new feed items
5. Implement feed reading history and bookmarking