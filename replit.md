# Health Tracker App

## Overview

This is a modern health tracking application built with a full-stack architecture using React, Express.js, and PostgreSQL. The app allows users to monitor their daily health metrics like steps, distance, calories, heart rate, sleep, and weight. Users can set goals, view progress through charts, and potentially connect with external health services. The application features a mobile-first design with dark/light theme support and uses Shadcn/UI components for a polished user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing with four main pages (Home, Activity, Goals, Profile)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with a custom design system based on Shadcn/UI components
- **Theme System**: Built-in dark/light mode toggle with local storage persistence
- **UI Components**: Comprehensive component library using Radix UI primitives with custom styling
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with JSON responses following conventional HTTP methods
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage**: In-memory storage implementation with interface for easy database migration
- **Development**: Hot reload with Vite middleware integration for seamless full-stack development
- **Error Handling**: Centralized error handling with structured JSON error responses

### Data Models
- **Users**: Basic user management with unique usernames and emails
- **Health Data**: Daily metrics including steps, distance, calories, heart rate, sleep, weight, and active minutes
- **Goals**: User-defined targets for daily steps, weekly distance, or daily active minutes
- **Connected Services**: Framework for integrating with external health platforms (Google Fit, Apple Health, Samsung Health)

### Authentication & Authorization
- Currently uses a default user system for development
- Built with expansion in mind for proper user authentication
- Session-based approach prepared for future implementation

### Development Tools
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Build System**: ESBuild for production builds with optimized bundling
- **Development**: Integrated development server with hot reload and error overlays
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Code Organization**: Monorepo structure with shared types and schemas

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Modern TypeScript ORM with excellent type safety
- **@tanstack/react-query**: Powerful data fetching and caching library
- **wouter**: Minimalist React router for single-page application navigation

### UI Framework
- **@radix-ui/react-\***: Complete suite of accessible UI primitives (40+ components)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe component variant system
- **lucide-react**: Modern icon library with consistent design

### Development Infrastructure
- **vite**: Fast build tool and development server
- **typescript**: Static type checking and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for production builds

### Database & Schema
- **drizzle-zod**: Integration between Drizzle ORM and Zod for validation
- **connect-pg-simple**: PostgreSQL session store for future authentication

### Additional Libraries
- **date-fns**: Modern date utility library for time calculations
- **react-hook-form**: Performant forms with validation
- **zod**: Schema validation for runtime type safety