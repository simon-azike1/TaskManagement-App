📋 Task Manager Application

A modern, full-stack task management application built with React (Vite) frontend and Node.js/Express backend, featuring MongoDB for data persistence.


🚀 **Live Demo**
• **Frontend**: [https://task-management-app-omega-flax.vercel.app](https://task-management-app-omega-flax.vercel.app)
• **Backend API**: [https://taskmanagement-app-2oq9.onrender.com](https://taskmanagement-app-2oq9.onrender.com)
• **API Health**: [https://taskmanagement-app-2oq9.onrender.com/api/health](https://taskmanagement-app-2oq9.onrender.com/api/health)


✨ **Features**
• ✅ **Create, Read, Update, Delete** tasks
• ✅ **Mark tasks as complete/incomplete**
• ✅ **Real-time task filtering** and sorting
• ✅ **Responsive design** with Tailwind CSS
• ✅ **Modern UI** with Lucide React icons
• ✅ **Fast development** with Vite
• ✅ **Cloud deployment** ready
• ✅ **Environment-aware** configuration


🛠️ **Tech Stack**

**Frontend**
• **React 19** - UI Library
• **Vite** - Build tool and dev server
• **Tailwind CSS** - Styling
• **Axios** - HTTP client
• **Lucide React** - Icons
• **Date-fns** - Date formatting


**Backend**
• **Node.js** - Runtime
• **Express.js** - Web framework
• **MongoDB** - Database
• **Mongoose** - ODM
• **CORS** - Cross-origin requests
• **dotenv** - Environment variables


**Deployment**
• **Frontend**: Vercel
• **Backend**: Render
• **Database**: MongoDB Atlas


🚀 **Quick Start**

**Prerequisites**
• Node.js (v18 or higher)
• npm or yarn
• MongoDB Atlas account (or local MongoDB)


**1. Clone the Repository**

git clone <your-repo-url>
cd task-manager


**2. Backend Setup**

cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and other settings


**backend/.env:**

MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-jwt-secret-key-here
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173


**3. Frontend Setup**

cd frontend
npm install


**4. Start Development Servers**

**Terminal 1 - Backend:**

cd backend
npm start
# Server runs on http://localhost:5000


**Terminal 2 - Frontend:**

cd frontend
npm run dev
# App runs on http://localhost:5173


📋 **API Endpoints**

Method	Endpoint	Description
`GET`	`/api/health`	Health check
`GET`	`/api/notes`	Get all tasks
`POST`	`/api/notes`	Create new task
`GET`	`/api/notes/:id`	Get specific task
`PUT`	`/api/notes/:id`	Update task
`DELETE`	`/api/notes/:id`	Delete task
`PATCH`	`/api/notes/:id/toggle`	Toggle task completion

🎯 **Available Scripts**

**Frontend Scripts**

npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run dev:local    # Dev with local API
npm run dev:prod     # Dev with production API


**Backend Scripts**

npm start            # Start server
npm run dev          # Start with nodemon (if installed)


🌍 **Environment Configuration**

The application automatically detects the environment and configures itself accordingly:


**Local Development**
• Frontend: `http://localhost:5173`
• Backend: `http://localhost:5000`
• Database: MongoDB Atlas (shared)


**Production**
• Frontend: Vercel deployment
• Backend: Render deployment
• Database: MongoDB Atlas


🚀 **Deployment**

**Frontend (Vercel)**
1. Connect your GitHub repository to Vercel
2. Set environment variables:
```bash
VITE_API_URL=https://taskmanagement-app-2oq9.onrender.com/api
```
3. Deploy automatically on push to main branch


**Backend (Render)**
1. Connect your GitHub repository to Render
2. Set environment variables:
```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```
3. Deploy automatically on push to main branch


🔧 **Configuration**

**MongoDB Setup**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` and `<dbname>` in the connection string


**Environment Variables**

**Required for Backend:**
• `MONGODB_URI` - MongoDB connection string
• `JWT_SECRET` - Secret key for JWT tokens
• `NODE_ENV` - Environment (development/production)
• `PORT` - Server port
• `FRONTEND_URL` - Frontend URL for CORS
• `CORS_ORIGIN` - CORS origin URL


**Optional for Frontend:**
• `VITE_API_URL` - Backend API URL (auto-detected if not set)


🐛 **Troubleshooting**

**Common Issues**
1. **CORS Errors**
- Check that frontend URL is correctly set in backend CORS configuration
- Verify environment variables are set correctly

2. **Database Connection Failed**
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure database user has correct permissions

3. **Port Already in Use**
- Change PORT in .env file
- Kill existing processes: `lsof -ti:5000 | xargs kill -9`

4. **Environment Variables Not Loading**
- Check .env file exists and is in correct directory
- Verify variable names (no spaces around =)
- Restart development servers after changes


🤝 **Contributing**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request



🙏 **Acknowledgments**
• React team for the amazing framework
• Vite for the lightning-fast build tool
• MongoDB for the flexible database
• Vercel and Render for easy deployment



**Happy Task Managing! 🚀✨**


⸻

*Built with grace using React, Node.js, and MongoDB*

<img width="1350" height="634" alt="image" src="https://github.com/user-attachments/assets/a8e380dd-3ba2-4d2b-bfd5-d8193b28502a" />
