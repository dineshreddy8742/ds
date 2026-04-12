# DialSmart AI Platform

A production-ready, full-stack Voice AI Platform built with **React + Vite**, **Express.js**, and **Supabase** featuring Supabase Auth, multi-tenant architecture, and automated lead distribution.

## 🚀 Features

### Authentication & Security
- ✅ **Supabase Auth** - Enterprise-grade authentication
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Email Verification** - Verify user emails
- ✅ **Row Level Security (RLS)** - Database-level access control
- ✅ **Role-Based Access** - Admin and College roles
- ✅ **Session Management** - Automatic session persistence

### Admin Features
- ✅ **College Management** - Create, update, delete college accounts
- ✅ **Bulk Lead Import** - Upload Excel/CSV files
- ✅ **Lead Distribution** - Assign leads to specific colleges
- ✅ **Analytics Dashboard** - View platform-wide statistics

### College Features
- ✅ **Lead Dashboard** - View assigned leads
- ✅ **Search & Filter** - Find leads by name, phone, or email
- ✅ **Pagination** - Navigate through large datasets
- ✅ **Export to Excel** - Download leads as Excel files
- ✅ **Real-time Stats** - Dynamic analytics calculation

### Developer Features
- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Input Validation** - Zod schemas for all API endpoints
- ✅ **Error Handling** - Global error boundaries and middleware
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Security Headers** - Helmet.js for HTTP security
- ✅ **Request Logging** - Morgan HTTP logger
- ✅ **Toast Notifications** - User-friendly feedback

---

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project ([supabase.com](https://supabase.com))

---

## 🛠️ Installation

### 1. Clone the repository

\`\`\`bash
cd dialsmart-app
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to **Project Settings > API**
4. Copy your **Project URL** and **anon public key**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=20

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
\`\`\`

Create a `.env` file for the frontend (Vite):

\`\`\`env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3001/api
\`\`\`

### 5. Set up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `database.sql`
3. Run the SQL script in the editor
4. This will create all tables, indexes, triggers, and RLS policies

### 6. Create Admin User

**Option A: Via Supabase Dashboard**
1. Go to **Authentication > Users** in Supabase
2. Click **Add User**
3. Enter email: `admin@dialsmart.ai`
4. Set a password (minimum 6 characters)
5. In **User Metadata**, add:
   \`\`\`json
   {
     "role": "ADMIN",
     "full_name": "Admin User"
   }
   \`\`\`

**Option B: Via Signup Page**
1. Run the app (see next section)
2. Go to `/signup`
3. Select "Admin" as account type
4. Fill in the form and submit

---

## 🚀 Running the Application

### Development Mode (Frontend + Backend)

\`\`\`bash
npm run dev
\`\`\`

This starts both the Vite dev server (port 5173) and Express server (port 3001) concurrently.

### Frontend Only

\`\`\`bash
npm run dev:frontend
\`\`\`

### Backend Only

\`\`\`bash
npm run dev:backend
\`\`\`

### Production Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

---

## 📁 Project Structure

\`\`\`
dialsmart-app/
├── server/
│   ├── controllers/       # Request handlers
│   │   ├── leadController.js
│   │   ├── collegeController.js
│   │   └── fileController.js
│   ├── middleware/         # Express middleware
│   │   ├── auth.js        # Supabase Auth verification
│   │   ├── validate.js    # Zod validation
│   │   └── error.js       # Error handling
│   ├── routes/            # API routes
│   │   ├── leads.js
│   │   ├── colleges.js
│   │   └── upload.js
│   ├── services/          # Business logic
│   │   ├── leadService.js
│   │   └── collegeService.js
│   ├── validators.js      # Zod schemas
│   ├── supabase.js        # Supabase client
│   └── index.js           # Server entry point
│
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Button, Input, Modal, etc.
│   │   └── layout/        # Sidebar, etc.
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── lib/               # Utilities
│   │   └── supabase.js    # Supabase client
│   ├── pages/             # Page components
│   │   ├── auth/          # Login, Signup, etc.
│   │   ├── admin/         # Admin portal
│   │   ├── college/       # College portal
│   │   └── *.jsx
│   ├── services/          # API client functions
│   │   └── api.js
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
│
├── database.sql           # Database schema
├── .env                   # Environment variables
├── package.json
└── vite.config.js
\`\`\`

---

## 🔐 Security Features

### Supabase Auth
- Password hashing (bcrypt)
- Email verification
- Password reset via email
- JWT session management
- Automatic token refresh

### Row Level Security (RLS)
- **Admins**: Can view/manage all colleges and leads
- **Colleges**: Can only view their assigned leads
- Database-level enforcement (cannot be bypassed)

### API Security
- Helmet.js security headers
- CORS whitelisting
- Rate limiting (100 req/15min general, 20 req/15min auth)
- Zod input validation
- File type validation for uploads
- File size limits (10MB default)

---

## 📡 API Endpoints

All endpoints (except auth) require `Authorization: Bearer <token>` header.

### Leads
\`\`\`
GET    /api/leads              # Get paginated leads with filters
GET    /api/leads/stats        # Get lead statistics
GET    /api/leads/:id          # Get single lead
POST   /api/leads              # Create lead (admin only)
PUT    /api/leads/:id          # Update lead
DELETE /api/leads/:id          # Delete lead (admin only)
\`\`\`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `search` - Search by name, phone, or email
- `status` - Filter by status

### Colleges
\`\`\`
GET    /api/colleges           # Get all colleges (admin only)
GET    /api/colleges/:id       # Get single college (admin only)
POST   /api/colleges           # Create college (admin only)
PUT    /api/colleges/:id       # Update college (admin only)
DELETE /api/colleges/:id       # Delete college (admin only)
\`\`\`

### File Upload
\`\`\`
POST   /api/upload             # Upload Excel/CSV file (admin only)
\`\`\`

### Health Check
\`\`\`
GET    /api/health             # Server health status
\`\`\`

---

## 🎨 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool
- **React Router 7** - Client-side routing
- **React Hot Toast** - Notifications
- **XLSX** - Excel export

### Backend
- **Express.js 5** - Web framework
- **Supabase JS** - Database & Auth
- **Zod** - Schema validation
- **Multer** - File uploads
- **Helmet** - Security headers
- **Morgan** - HTTP logger
- **Express Rate Limit** - Rate limiting

### Database
- **Supabase (PostgreSQL)** - Managed database
- **Row Level Security** - Access control
- **Triggers** - Auto-update timestamps
- **Indexes** - Query optimization

---

## 🧪 Testing

**Note:** Test suite is planned but not yet implemented.

Recommended testing stack:
- **Vitest** - Unit tests
- **React Testing Library** - Component tests
- **Supertest** - API integration tests

---

## 🚧 Future Enhancements

- [ ] Email notifications for new leads
- [ ] Real-time updates via WebSockets
- [ ] Advanced lead filtering (date range, intent)
- [ ] Lead notes and activity tracking
- [ ] Bulk lead operations (delete, reassign)
- [ ] Audit log viewer
- [ ] User profile editing
- [ ] Two-factor authentication (2FA)
- [ ] OAuth social logins
- [ ] Dashboard charts (Recharts)
- [ ] Mobile-responsive improvements
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] API documentation (Swagger)
- [ ] Test coverage (70%+ target)

---

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anon public key | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Required |
| `PORT` | Backend server port | 3001 |
| `NODE_ENV` | Environment (development/production) | development |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | 900000 (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `AUTH_RATE_LIMIT_MAX` | Max auth attempts per window | 20 |
| `MAX_FILE_SIZE` | Max upload size in bytes | 10485760 (10MB) |
| `UPLOAD_DIR` | Directory for uploaded files | uploads |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Support

For support, email support@dialsmart.ai or open an issue in the repository.

---

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend platform
- **Vite** - For the blazing-fast build tool
- **React** - For the UI library
- **Express** - For the web framework

---

**Built with ❤️ by DialSmart Team**
