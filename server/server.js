const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store current state
let currentState = {
    buttonId: null,
    subcategoryId: null,
    timestamp: null
};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current state to newly connected clients
    socket.emit('state-update', currentState);

    // Handle button press from remote control
    socket.on('button-press', (data) => {
        console.log('Button pressed:', data);
        currentState = {
            buttonId: data.buttonId,
            subcategoryId: data.subcategoryId,
            timestamp: Date.now()
        };
        
        // Broadcast to all connected displays
        io.emit('state-update', currentState);
    });

    // Handle reset
    socket.on('reset', () => {
        console.log('Reset triggered');
        currentState = {
            buttonId: null,
            subcategoryId: null,
            timestamp: Date.now()
        };
        io.emit('state-update', currentState);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// REST endpoint to get current state
app.get('/api/state', (req, res) => {
    res.json(currentState);
});

// REST endpoint to set state (alternative to WebSocket)
app.post('/api/button-press', (req, res) => {
    const { buttonId, subcategoryId } = req.body;
    currentState = {
        buttonId,
        subcategoryId,
        timestamp: Date.now()
    };
    io.emit('state-update', currentState);
    res.json({ success: true, state: currentState });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Remote control: http://localhost:3000`);
    console.log(`Display: http://localhost:3000/display`);
});
