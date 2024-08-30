const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const server = http.createServer(app);
const io = socketIO(server);

// Setting up ejs
app.set('view engine', 'ejs');

// Use express.static as middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New client connected...');

    socket.on('location', (data) => {
        console.log('Location data received:', data);
        // Broadcast to all clients
        io.emit('location-received', { id: socket.id, lat: data.latitude, lon: data.longitude });
        console.log('Broadcasted');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected...');
        // Optionally, notify all clients about the disconnection
        io.emit('client-disconnected', { id: socket.id });
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3020, () => console.log('Server running on port 3020...'));
