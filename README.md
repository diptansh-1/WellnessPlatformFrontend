# Wellness Platform Frontend

A React-based frontend for the Wellness Platform, featuring session management, authentication, and real-time autosave functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd wellness-platform/frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AUTO_SAVE_DELAY=5000
```

4. Start the development server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🎯 Features

### Authentication
- User registration and login
- Protected routes
- Persistent sessions
- Automatic token management

### Session Management
- Create and edit sessions
- Autosave functionality
- Draft and publish workflow
- Tag-based organization
- Session listing and filtering

### UI Components
- Responsive navigation
- Loading states
- Toast notifications
- Form validation
- Protected routes

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── LoadingSpinner.js
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.js
│   │   └── SessionCard.js
│   ├── context/           # React Context providers
│   │   └── AuthContext.js
│   ├── pages/            # Page components
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── MySessions.js
│   │   ├── Register.js
│   │   └── SessionEditor.js
│   ├── utils/            # Utility functions
│   │   ├── api.js
│   │   └── debounce.js
│   ├── App.js
│   └── index.js
└── package.json
```

## 📱 Available Routes

### Public Routes
- `/` - Home/Dashboard page
- `/login` - User login
- `/register` - User registration

### Protected Routes (requires authentication)
- `/dashboard` - User dashboard
- `/my-sessions` - List of user's sessions
- `/session/new` - Create new session
- `/session/edit/:id` - Edit existing session

## 🔌 API Integration

The frontend communicates with the backend through a centralized API client (`src/utils/api.js`).

### Authentication API
```javascript
// Register user
POST /api/auth/register
Body: { email, password }

// Login user
POST /api/auth/login
Body: { email, password }

// Get current user
GET /api/auth/me
Headers: { Authorization: 'Bearer token' }
```

### Sessions API
```javascript
// Get public sessions
GET /api/sessions
Query: { page, limit, tags }

// Get user's sessions
GET /api/my-sessions
Headers: { Authorization: 'Bearer token' }

// Get single session
GET /api/my-sessions/:id
Headers: { Authorization: 'Bearer token' }

// Save draft
POST /api/my-sessions/save-draft
Headers: { Authorization: 'Bearer token' }
Body: { title, tags, json_file_url }

// Publish session
POST /api/my-sessions/publish
Headers: { Authorization: 'Bearer token' }
Body: { sessionId, title, tags, json_file_url }

// Delete session
DELETE /api/my-sessions/:id
Headers: { Authorization: 'Bearer token' }
```

## ⚡ State Management

The application uses React Context for state management:

### AuthContext
- Manages user authentication state
- Handles token storage and management
- Provides auth-related actions (login, register, logout)

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Responsive design
- Custom components following design system
- CSS modules for component-specific styles

## ⚙️ Development Features

- Hot reloading
- Environment variable management
- Error boundary implementation
- Development proxy configuration
- Toast notifications for user feedback
- Form validation and error handling
- Protected route implementation
- Autosave functionality for forms

## 🔧 Error Handling

The application implements comprehensive error handling:
- API error interceptors
- Form validation feedback
- Toast notifications for user feedback
- Loading states for async operations
- Protected route redirects
- Session persistence
