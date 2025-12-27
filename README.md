# Frontend - Media Download Interface

## Overview
A React-based frontend application built with Vite that provides a user interface for downloading media from YouTube, Instagram, and other platforms. Communicates with the backend API to handle download operations.

## Features
- **Modern React UI**: Built with React 19.2.0
- **Fast Build Tool**: Vite for optimized development and production builds
- **ESLint Integration**: Code quality and style checking
- **Responsive Design**: Clean and intuitive user interface

## Tech Stack
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: CSS modules and global styles
- **Linting**: ESLint 9.39.1
- **Package Manager**: npm

## Installation
1. Install dependencies:
```bash
npm install
```

## Development
Start the development server with hot module replacement (HMR):
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

## Production Build
Build for production:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

## Code Quality
Run ESLint to check code style:
```bash
npm run lint
```

## Project Structure
```
frontend/
├── src/
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── main.jsx        # Application entry point
│   ├── index.css       # Global styles
│   └── assets/         # Static assets
├── public/             # Public assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── eslint.config.js    # ESLint configuration
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## Configuration
- **Vite Config**: See `vite.config.js` for build and dev server settings
- **ESLint Config**: See `eslint.config.js` for code quality rules

## API Integration
The frontend communicates with the backend API running on `http://localhost:3000`. Ensure the backend server is running before using the application.

## Notes
- The application uses React 19.2.0 with the latest features
- Vite provides fast build times and optimized bundles
- Hot Module Replacement (HMR) is enabled during development for instant updates
