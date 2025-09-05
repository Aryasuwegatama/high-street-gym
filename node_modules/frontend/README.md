# High Street Gym - Management System

A comprehensive full-stack web application for managing gym operations, including memberships, classes, bookings, blogs, and facilities management.

## 🏋️‍♂️ Overview

High Street Gym Management System is a modern web application designed to streamline gym operations. It provides role-based access control for members, trainers, and administrators, along with features for class booking, blog management, and facility oversight.

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role system**: Member, Trainer, Admin
- **Secure authentication**: JWT-based token system
- **Role-based access control**: Different permissions for each user type
- **Account management**: Profile updates and password management

### 📅 Class & Booking Management
- **Class scheduling**: Create and manage fitness classes
- **Real-time booking**: Book classes with trainer selection
- **Capacity management**: Automatic booking limits based on activity capacity
- **Booking history**: Track and manage user bookings
- **Trainer availability**: View and manage trainer schedules

### 🏢 Club & Facility Management
- **Multiple locations**: Manage multiple gym branches
- **Interactive maps**: Location visualization with coordinates
- **Facility tracking**: Manage amenities and equipment per club
- **Contact information**: Store and display club details

### 📝 Blog System
- **Content creation**: Create and publish blog posts
- **User blogs**: Members can write and share content
- **Blog management**: Admin oversight of all blog content
- **Rich content**: Support for formatted text and media

### 🏃‍♀️ Activity Management
- **Activity catalog**: Comprehensive list of gym activities
- **Trainer assignments**: Assign trainers to specific activities
- **Capacity control**: Set and manage activity participant limits
- **Duration tracking**: Track activity duration and scheduling

### 📊 Administrative Tools
- **User management**: Create, update, and manage user accounts
- **Data import**: XML import functionality for bulk data operations
- **Analytics dashboard**: Overview of gym operations
- **System monitoring**: Track bookings, users, and activities

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast development build tool
- **React Router Dom**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Tailwind component library
- **FontAwesome**: Icon library
- **React Leaflet**: Interactive maps
- **React Calendar**: Date selection components

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MySQL2**: MySQL database driver
- **bcryptjs**: Password hashing
- **UUID**: Unique identifier generation
- **express-validator**: Input validation
- **CORS**: Cross-origin resource sharing
- **Multer**: File upload handling
- **xml2js**: XML parsing
- **Nodemon**: Development auto-restart

### Database
- **MySQL**: Relational database management system
- **Connection pooling**: Efficient database connections
- **Structured schema**: Normalized database design

## 📁 Project Structure

```
high-street-gym/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication & validation
│   │   ├── database.js      # Database configuration
│   │   └── server.js        # Express server setup
│   └── package.json
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── api/             # API service functions
│   │   ├── context/         # React context providers
│   │   ├── public/          # Static assets
│   │   └── main.jsx         # Application entry point
│   └── package.json
├── xml/                     # Sample XML files
└── package.json             # Workspace configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

### Database Setup
1. Create a MySQL database named `high-street-gym`
2. Update database credentials in `backend/src/database.js`:
   ```javascript
   export const db = mysql.createPool({
       host: "localhost",
       user: "your_username",
       password: "your_password",
       database: "high-street-gym"
   })
   ```
3. Run your database schema setup (SQL files in `frontend/src/sql-template/`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd high-street-gym
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   # Start backend server (http://localhost:5000)
   npm run backend
   
   # Start frontend development server (http://localhost:5173)
   npm run frontend
   ```

### Available Scripts

```bash
# Root level commands
npm run backend      # Start backend server with nodemon
npm run frontend     # Start frontend development server

# Backend specific
cd backend
npm start           # Start backend with nodemon
npm run test        # Run backend tests

# Frontend specific  
cd frontend
npm run dev         # Start Vite development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=high-street-gym
```

### API Endpoints
The backend API runs on `http://localhost:5000` with the following main routes:
- `/users` - User management and authentication
- `/classes` - Class scheduling and management
- `/bookings` - Booking operations
- `/activities` - Activity management
- `/clubs` - Club and facility management
- `/blogs` - Blog content management
- `/xml-upload` - XML import functionality

## 👥 User Roles & Permissions

### 👤 Member
- View and book classes
- Manage personal bookings
- Create and manage personal blogs
- View club information
- Update personal profile

### 🏋️‍♂️ Trainer
- All member permissions
- View assigned activities
- Manage class schedules
- View booking information
- Update trainer availability

### 👨‍💼 Admin
- All trainer permissions
- User management (create, update, delete)
- Class and activity management
- Club management
- Blog moderation
- XML data import
- System analytics

## 📄 XML Import Feature

The system supports bulk data import via XML files:

### Activity Import
Upload XML files to import/update activities with trainer assignments:
```xml
<activities-upload operation="insert">
  <activities>
    <activity>
      <name>Yoga</name>
      <capacity>20</capacity>
      <duration>60</duration>
      <description>Relaxing yoga session</description>
      <trainers>
        <trainer>1</trainer>
        <trainer>2</trainer>
      </trainers>
      <club_id>1</club_id>
    </activity>
  </activities>
</activities-upload>
```

### Club Import
Upload XML files to import/update club information:
```xml
<clubs-upload operation="insert">
  <clubs>
    <club>
      <name>Downtown Branch</name>
      <address>123 Main St</address>
      <phone>555-0123</phone>
      <email>downtown@highstreetgym.com</email>
      <latitude>-37.8136</latitude>
      <longitude>144.9631</longitude>
      <facilities>Pool;Sauna;Steam Room</facilities>
    </club>
  </clubs>
</clubs-upload>
```

## 🚧 Development

### Code Style
- **ESLint**: Configured for React and modern JavaScript
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling approach

### Project Conventions
- **Component naming**: PascalCase for React components
- **File naming**: camelCase for utilities, PascalCase for components
- **API structure**: RESTful endpoints with proper HTTP methods
- **Database naming**: snake_case for database fields

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Fails**
   - Verify MySQL is running
   - Check database credentials in `database.js`
   - Ensure database exists

2. **Frontend Won't Load**
   - Check if backend is running on port 5000
   - Verify API_URL in frontend configuration
   - Clear browser cache

3. **Authentication Issues**
   - Check if auth tokens are being stored
   - Verify middleware configuration
   - Check CORS settings

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Arya Suwegatama**

---

*Built with ❤️ for High Street Gym*
