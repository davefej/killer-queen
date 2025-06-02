# Killer Queen Game Server

This is the WebSocket server for the Killer Queen game. It manages game state and synchronizes data between connected clients using Socket.IO.

## Features

- Real-time data synchronization between game clients
- Collection management (create, update, add items)
- Periodic data broadcasting to ensure clients stay in sync

## Setup

1. Make sure you have Node.js installed (version 14 or higher recommended)
2. Install dependencies:

```bash
cd server
npm install
```

## Running the Server

Start the server in development mode (with auto-restart on file changes):

```bash
npm run dev
```

Or start in production mode:

```bash
npm start
```

The server will run on port 3000 by default. You can change this by setting the PORT environment variable.

## How It Works

- The server uses Socket.IO to establish WebSocket connections with clients
- Collections are stored in memory on the server
- When clients connect, they receive the current state of all collections
- The server broadcasts updates to all connected clients when data changes
- Every 5 seconds, the server sends the current state to all clients to ensure synchronization
