# High Street Gym - Management System

A comprehensive full-stack web application for managing gym operations, including memberships, classes, bookings, blogs, and facilities management.

![High Street Gym](./frontend/public/banner-image.jpg)

## 🏋️‍♂️ Overview

High Street Gym Management System is a modern web application designed to streamline gym operations. It provides role-based access control for members, trainers, and administrators, along with features for class booking, blog management, and facility oversight.

## ✨ Key Features

- 🔐 **Multi-role Authentication** (Member, Trainer, Admin)
- 📅 **Class Booking & Management**
- 🏢 **Multi-location Club Management**
- 📝 **Blog Content System**
- 🏃‍♀️ **Activity & Trainer Management**
- 📊 **Administrative Dashboard**
- 📄 **XML Bulk Import**
- 🗺️ **Interactive Club Maps**

## 🛠️ Technology Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** + **DaisyUI**
- **React Router Dom**
- **React Leaflet** (Maps)
- **FontAwesome Icons**

### Backend
- **Node.js** + **Express.js**
- **MySQL2** Database
- **bcryptjs** Authentication
- **express-validator**
- **XML2JS** Parser

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd high-street-gym
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   - Create database: `high-street-gym`
   - Update credentials in `backend/src/database.js`
   - Import schema from `frontend/src/sql-template/`

4. **Start the application**
   ```bash
   # Terminal 1: Start backend (port 5000)
   npm run backend
   
   # Terminal 2: Start frontend (port 5173)
   npm run frontend
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
high-street-gym/
├── 📂 backend/                 # Express.js API Server
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Business logic
│   │   ├── 📂 models/          # Database models
│   │   ├── 📂 routes/          # API endpoints
│   │   ├── 📂 middleware/      # Auth & validation
│   │   ├── 📄 database.js      # DB configuration
│   │   └── 📄 server.js        # App entry point
│   └── 📄 package.json
├── 📂 frontend/                # React Application
│   ├── 📂 src/
│   │   ├── 📂 components/      # UI components
│   │   ├── 📂 pages/           # Page components
│   │   ├── 📂 api/             # API services
│   │   ├── 📂 context/         # React context
│   │   └── 📄 main.jsx         # App entry point
│   ├── 📂 public/              # Static assets
│   └── 📄 package.json
├── 📂 xml/                     # Sample XML files
└── 📄 package.json             # Workspace config
```

## 👥 User Roles & Access

| Role | Permissions |
|------|-------------|
| **👤 Member** | Book classes, manage bookings, create blogs, view clubs |
| **🏋️‍♂️ Trainer** | Member permissions + manage assigned activities & schedules |
| **👨‍💼 Admin** | Full access + user management, data import, system analytics |

## 🔧 Available Scripts

```bash
# Workspace level
npm run backend      # Start backend server
npm run frontend     # Start frontend dev server

# Backend specific
cd backend && npm start    # Start with nodemon

# Frontend specific  
cd frontend && npm run dev     # Development server
cd frontend && npm run build   # Production build
cd frontend && npm run lint    # ESLint check
```

## 🗃️ Database Configuration

Update your MySQL connection in `backend/src/database.js`:

```javascript
export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "high-street-gym"
})
```

## 📡 API Endpoints

Base URL: `http://localhost:5000`

| Endpoint | Purpose |
|----------|---------|
| `/users` | Authentication & user management |
| `/classes` | Class scheduling & management |
| `/bookings` | Booking operations |
| `/activities` | Activity management |
| `/clubs` | Club & facility management |
| `/blogs` | Blog content management |
| `/xml-upload` | XML import functionality |

## 📄 XML Import Feature

Bulk import data using XML files:

### Activities Import
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
      </trainers>
      <club_id>1</club_id>
    </activity>
  </activities>
</activities-upload>
```

### Clubs Import
```xml
<clubs-upload operation="insert">
  <clubs>
    <club>
      <name>Downtown Branch</name>
      <address>123 Main St</address>
      <phone>555-0123</phone>
      <email>downtown@gym.com</email>
      <latitude>-37.8136</latitude>
      <longitude>144.9631</longitude>
      <facilities>Pool;Sauna;Steam Room</facilities>
    </club>
  </clubs>
</clubs-upload>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions
- **Input Validation**: Server-side validation with express-validator
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Configured cross-origin policies

## 🧪 Testing & Development

### Code Quality
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

### Development Workflow
1. Make changes to frontend/backend
2. Auto-reload with Vite/Nodemon
3. Test functionality
4. Commit changes

## 🐛 Troubleshooting

### Common Issues

**🔴 Database Connection Failed**
```bash
# Check MySQL is running
sudo service mysql start

# Verify credentials in database.js
# Ensure database exists
```

**🔴 Port Already in Use**
```bash
# Find process using port
lsof -i :5000  # or :5173

# Kill process
kill -9 <PID>
```

**🔴 Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Arya Suwegatama**
- GitHub: [@Aryasuwegatama](https://github.com/Aryasuwegatama)
- Project: High Street Gym Management System

## 🙏 Acknowledgments

- Built as part of TAFE Diploma Web Services Course
- React + Vite for modern frontend development
- Express.js for robust backend API
- MySQL for reliable data storage

---

<div align="center">

**🏋️‍♂️ Built with ❤️ for High Street Gym 🏋️‍♀️**

</div>