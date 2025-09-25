# SecureVision Backend

AI-powered CCTV Surveillance and Analytics backend API.

## Features

- **Authentication**: JWT-based user authentication and authorization
- **User Management**: User registration, login, profile management
- **Store Management**: Multi-store support with location tracking
- **Camera Management**: Camera configuration and status monitoring
- **Real-time Alerts**: Socket.io for live alert notifications
- **Analytics**: Comprehensive analytics and reporting
- **Demo Requests**: Lead capture and management system

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/securevision
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   SOCKET_CORS_ORIGIN=http://localhost:5173
   ```

3. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   ```

4. **Run the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/shrinkage` - Global shrinkage data
- `GET /api/analytics/trends` - Incident trends
- `GET /api/analytics/crowd-flow` - Crowd flow analytics

### Demo Requests
- `POST /api/demo-requests` - Create demo request
- `GET /api/demo-requests` - Get all requests (Admin)
- `GET /api/demo-requests/:id` - Get request by ID
- `PUT /api/demo-requests/:id/status` - Update request status
- `PUT /api/demo-requests/:id/assign` - Assign request

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store
- `GET /api/stores/:id/analytics` - Store analytics

### Cameras
- `GET /api/cameras` - Get all cameras
- `GET /api/cameras/:id` - Get camera by ID
- `POST /api/cameras` - Add camera
- `PUT /api/cameras/:id` - Update camera
- `DELETE /api/cameras/:id` - Delete camera
- `PUT /api/cameras/:id/status` - Update camera status
- `GET /api/cameras/:id/analytics` - Camera analytics

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert by ID
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/resolve` - Resolve alert
- `GET /api/alerts/stats` - Alert statistics

## Socket.io Events

### Client to Server
- `join-store` - Join a store room for real-time updates
- `leave-store` - Leave a store room

### Server to Client
- `new-alert` - New alert notification
- `alert-resolved` - Alert resolved notification
- `camera-status-change` - Camera status update
- `system-notification` - System-wide notification

## Database Models

### User
- name, email, password, role, company
- isActive, lastLogin, stores[]

### Store
- storeName, address, coordinates
- cameraCount, linkedUser, settings
- metrics (totalAlerts, lastAlert, averageFootfall)

### Camera
- name, ip, port, username, password
- storeId, location, status, capabilities
- settings (resolution, frameRate, recordingEnabled)

### ActivityLog
- timestamp, type, severity, details
- storeId, cameraId, userId
- isResolved, resolvedAt, resolvedBy
- location, imageUrl, videoUrl

### DemoRequest
- name, email, company, message
- camerasNeeded, industry, storeSize
- budget, timeline, status
- assignedTo, notes[], contactAttempts

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure JWT secrets
4. Configure proper CORS origins
5. Use a process manager like PM2
6. Set up reverse proxy (nginx)
7. Enable HTTPS
8. Monitor logs and performance

## License

MIT License - see LICENSE file for details
