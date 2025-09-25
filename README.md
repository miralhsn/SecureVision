# SecureVision - AI-Powered CCTV Surveillance & Analytics

A comprehensive surveillance and analytics platform built with React, Node.js, and MongoDB. SecureVision provides real-time threat detection, intelligent alerts, and actionable insights for enterprise security.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI**: Clean, elegant design with glassmorphism effects
- **Real-time Dashboard**: Live camera feeds and analytics
- **Interactive Maps**: Global retail shrinkage visualization
- **Responsive Design**: Works on all devices
- **Authentication**: Secure login/signup system
- **Demo Requests**: Lead capture with workflow visualization

### Backend (Node.js + Express)
- **RESTful API**: Comprehensive API for all operations
- **Real-time Communication**: Socket.io for live alerts
- **Authentication**: JWT-based security
- **Database**: MongoDB with Mongoose ODM
- **Analytics**: Advanced reporting and insights
- **Multi-tenant**: Support for multiple stores/users

### AI & Analytics
- **Threat Detection**: Real-time suspicious activity detection
- **Behavior Analysis**: Machine learning-powered insights
- **Alert System**: Instant notifications and escalation
- **Reporting**: Comprehensive analytics and exports
- **Global Data**: Retail shrinkage statistics worldwide

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Recharts** - Data visualization
- **React Simple Maps** - Geographic maps
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **Helmet** - Security headers

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update .env with your configuration
# Start development server
npm run dev

# Start production server
npm start
```

### Environment Configuration

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securevision
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
SOCKET_CORS_ORIGIN=http://localhost:5173
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/miralhsn/SecureVision
   cd securevision
   ```

2. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Start Frontend**
   ```bash
   npm install
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 📁 Project Structure

```
securevision/
├── src/                          # Frontend source
│   ├── components/               # Reusable components
│   │   ├── Navigation.tsx       # Main navigation
│   │   ├── Footer.tsx           # Site footer
│   │   ├── BackToTop.tsx        # Scroll to top
│   │   ├── ExportModal.tsx      # Export functionality
│   │   └── Head.tsx             # SEO meta tags
│   ├── pages/                   # Page components
│   │   ├── Home.tsx             # Landing page
│   │   ├── Dashboard.tsx        # Analytics dashboard
│   │   ├── Features.tsx         # Use cases page
│   │   ├── Workflow.tsx         # Demo request page
│   │   ├── Login.tsx            # Login page
│   │   ├── Signup.tsx           # Registration page
│   │   └── About.tsx            # About page
│   ├── services/                # API services
│   │   ├── api.js               # API client
│   │   └── socket.js            # Socket.io client
│   ├── types/                   # TypeScript types
│   └── main.tsx                 # App entry point
├── backend/                     # Backend source
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Custom middleware
│   │   └── services/            # Business logic
│   ├── server.js                # Server entry point
│   └── package.json
├── public/                      # Static assets
└── README.md
```

## 🔧 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/shrinkage` - Global shrinkage data
- `GET /api/analytics/trends` - Incident trends
- `GET /api/analytics/crowd-flow` - Crowd analytics

### Demo Requests
- `POST /api/demo-requests` - Create demo request
- `GET /api/demo-requests` - Get all requests (Admin)
- `PUT /api/demo-requests/:id/status` - Update status

### Stores & Cameras
- `GET /api/stores` - Get stores
- `POST /api/stores` - Create store
- `GET /api/cameras` - Get cameras
- `POST /api/cameras` - Add camera

### Alerts
- `GET /api/alerts` - Get alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/resolve` - Resolve alert

## 🎨 UI Components

### Design System
- **Color Scheme**: Bluish, modern, Ferrari-style elegance
- **Typography**: Clean, readable fonts
- **Layout**: Responsive grid system
- **Animations**: Smooth, subtle transitions
- **Glassmorphism**: Frosted glass effects

### Key Components
- **Navigation**: Sticky header with active states
- **Cards**: Glass-morphism containers
- **Maps**: Interactive world map with data visualization
- **Charts**: Real-time analytics with Recharts
- **Forms**: Clean, accessible form components
- **Modals**: Export and confirmation dialogs

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Data sanitization
- **Role-based Access**: User permission system

## 📊 Analytics & Reporting

### Dashboard Metrics
- **Active Cameras**: Online/offline status
- **Alert Statistics**: By type and severity
- **Incident Trends**: Time-based analysis
- **Resolution Rates**: Performance metrics
- **Crowd Flow**: Density and movement patterns

### Export Features
- **PDF Reports**: Comprehensive analytics reports
- **CSV Data**: Raw data export
- **Real-time Updates**: Live data streaming
- **Custom Timeframes**: Flexible date ranges

## 🌍 Global Features

### Retail Shrinkage Map
- **Interactive World Map**: Visual data representation
- **Country Data**: Shrinkage percentages by region
- **Real-time Updates**: Live data from backend
- **Tooltips**: Detailed information on hover

### Multi-tenant Support
- **Store Management**: Multiple location support
- **User Roles**: Admin, Manager, Operator
- **Data Isolation**: Secure data separation
- **Scalable Architecture**: Handle growing needs

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Deploy backend folder
```

### Database (MongoDB Atlas)
- Create cluster
- Get connection string
- Update MONGODB_URI

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@securevision.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database
- All open-source contributors

---

**SecureVision** - *Intelligent surveillance that prevents incidents before they happen.*