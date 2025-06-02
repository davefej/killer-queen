const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const path = require('path');
const app = express();

// Set up CORS middleware for Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server with enhanced CORS settings
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store our collections in memory
const collections = new Map();

// Set up static file serving
app.use(express.static(path.join(__dirname, '..')));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WebSocket server is running' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data to the newly connected client
  for (const [key, value] of collections.entries()) {
    socket.emit('collection_update', { key, value });
  }

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle collection updates
  socket.on('update_collection', (data) => {
    const { key, value } = data;
    collections.set(key, value);
    
    // Broadcast the update to all connected clients
    io.emit('collection_update', { key, value });
  });

  // Handle adding to collection
  socket.on('add_to_collection', (data) => {
    const { key, value } = data;
    let collection = collections.get(key) || [];
    collection.push(value);
    collections.set(key, collection);
    
    // Broadcast the update to all connected clients
    io.emit('collection_update', { key, value: collection });
  });
});

// Set up periodic updates (every 5 seconds)
setInterval(() => {
  for (const [key, value] of collections.entries()) {
    io.emit('collection_update', { key, value });
  }
}, 5000);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
