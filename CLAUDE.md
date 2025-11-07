# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a chat room application with a client-server architecture:

- **Server**: NestJS backend using TypeScript
- **Client**: React frontend with TypeScript using Vite

The project is organized as separate `server/` and `client/` directories, each with their own package.json and dependencies.

## Development Commands

### Server (NestJS)
Navigate to `server/` directory first:

```bash
cd server
pnpm install
```

Common commands:
- `pnpm run start` - Start server in development mode
- `pnpm run start:dev` - Start server with hot reload (watch mode)
- `pnpm run build` - Build the application
- `pnpm run lint` - Run ESLint and fix issues
- `pnpm run format` - Format code with Prettier
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm run test:cov` - Run tests with coverage report

### Client (React + Vite)
Navigate to `client/` directory first:

```bash
cd client
pnpm install
```

Common commands:
- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production (runs TypeScript check + Vite build)
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build locally

## Key Files

### Server Structure
- `server/src/main.ts` - Application entry point
- `server/src/app.module.ts` - Root module with basic NestJS structure
- `server/src/app.controller.ts` - Application controller
- `server/src/app.service.ts` - Application service
- `server/package.json` - Server dependencies and scripts

### Client Structure
- `client/src/App.tsx` - Main React application component
- `client/src/main.tsx` - React application entry point
- `client/vite.config.ts` - Vite configuration
- `client/package.json` - Client dependencies and scripts

## Testing

The server includes Jest for testing with configurations for both unit tests and e2e tests. Tests are located in the `server/test/` directory and use the `.spec.ts` naming convention.

## Code Quality

Both client and server use ESLint for code linting. The server also includes Prettier for code formatting. The project uses TypeScript throughout for type safety.