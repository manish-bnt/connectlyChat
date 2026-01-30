
const express = require('express')
const { Server } = require('socket.io')
const cors = require('cors')
const http = require('http')
const path = require('path')
const fs = require('fs')

const app = express()

// Create HTTP server so we can use socket.io with Express
const server = http.createServer(app)

// Path for uploads folder
// const UPLOAD_DIR = path.join(__dirname, 'uploads')

// Create uploads folder if it does not exist
// if (!fs.existsSync(UPLOAD_DIR)) {
//   fs.mkdirSync(UPLOAD_DIR)
// }

// Initialize socket.io server
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// })

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});


// Store socket.io instance in app
// This allows us to access io inside controllers
app.set('io', io)

require('dotenv').config()

// Enable CORS for all requests
// app.use(cors())

// app.options("*", cors());


app.use(cors({
  // origin: "*", // ya specific frontend URL
  // credentials: true
  // origin: [
  //   // "https://connectly-web.netlify.app",
  //   // "http://localhost:5173",
  //   // "http://192.168.100.5:5173"
  //   process.env.CLIENT_URL
  // ],

  // origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Allow server to read JSON request bodies
app.use(express.json())

// Make uploads folder publicly accessible
app.use('/uploads', express.static('uploads'))

// Import routes
const authRoute = require('./routes/authRoute.js')
const contactRoute = require('./routes/contactRoute.js')
const chatRoute = require('./routes/chatRoute.js')

// Import database connection function
const connectDB = require('./connection/connection.js')

// Register routes
app.get('/', (req, res) => {
  res.send({ msg: 'server is running' });
});
app.use('/auth', authRoute)
app.use('/contact', contactRoute)
app.use('/chat', chatRoute)

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected')

  // Get userId sent from frontend during socket connection
  const userId = socket.handshake.query.userId

  // If userId exists, join a room with userId
  // This room is used to send messages only to that user
  if (userId) {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  }

  // Demo users join a separate demo session room
  socket.on('joinDemoSession', (demoSessionId) => {
    socket.join(demoSessionId)
    console.log(`Demo session joined: ${demoSessionId}`)
  })

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// Server port
const PORT = process.env.PORT || 8080

// Connect database
connectDB()

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
