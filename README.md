# Clientalio - Video Testimonials Collection SaaS

A fast, mobile-responsive React.js web application for collecting video testimonials from clients.

## 🚀 Features

- **Authentication**: Secure login with Bearer token storage
- **Multiple Routes**: React Router for seamless navigation
- **Video Upload**: Collect video testimonials from clients
- **Dashboard**: View and manage all testimonials
- **Mobile Responsive**: Optimized for all screen sizes
- **Fast Performance**: Built with Vite for lightning-fast development and builds
- **Modern UI**: Clean, professional design matching Clientalio branding

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
app.clientalio/
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js         # Vite configuration
├── src/
│   ├── main.jsx           # Application entry point
│   ├── App.jsx            # Main App component with routing
│   ├── index.css          # Global styles
│   ├── components/
│   │   ├── Login.jsx              # Login page
│   │   ├── Dashboard.jsx          # Dashboard page
│   │   ├── CollectTestimonial.jsx # Testimonial collection page
│   │   └── PrivateRoute.jsx       # Protected route wrapper
│   ├── services/
│   │   └── api.js         # API service with axios
│   ├── utils/
│   │   └── auth.js        # Authentication utilities
│   └── styles/
│       ├── Login.css
│       ├── Dashboard.css
│       └── CollectTestimonial.css
```

## 🔐 Authentication

The app uses Bearer token authentication:

- **Login API**: `https://apiclientalio.azurewebsites.net/api/v1/Token`
- **Token Storage**: localStorage
- **Auto-redirect**: Unauthenticated users redirected to login
- **Token Injection**: Automatic Bearer token in API requests

### API Request Format (Login)
```javascript
POST /api/v1/Token
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Expected Response
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com"
  }
}
```

## 🛣️ Routes

- `/` - Redirects to dashboard or login
- `/login` - Login page
- `/dashboard` - Main dashboard (protected)
- `/collect` - Collect testimonial form (protected)

## 📱 Mobile Responsive Design

- Breakpoints: 480px, 768px, 1024px
- Flexible grid layouts
- Touch-friendly buttons
- Optimized forms for mobile

## ⚡ Performance Optimizations

- **Vite**: Fast HMR and optimized builds
- **Code Splitting**: Route-based lazy loading ready
- **Minification**: Terser for JS, CSS minification enabled
- **Asset Optimization**: Optimized bundle sizes

## 🎨 Design System

### Colors
- Primary: `#FF8C42`
- Secondary: `#FF6B35`
- Background: `#F8F9FA`
- Text Dark: `#2C3E50`
- Text Light: `#7F8C8D`

## 🔧 API Integration

All API calls are centralized in `src/services/api.js`:

```javascript
import { apiService } from './services/api';

// Login
const response = await apiService.login({ email, password });

// Get testimonials
const testimonials = await apiService.getTestimonials();

// Upload video
const formData = new FormData();
formData.append('video', videoFile);
await apiService.uploadVideo(formData);
```

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

---

© 2025 Clientalio. All rights reserved.
Developed with ❤️ in India by BWays Techno Solution
