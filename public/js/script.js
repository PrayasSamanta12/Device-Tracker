const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        socket.emit('location', { latitude, longitude });
    }, (error) => {
        console.log('Geolocation error:', error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0, // immediate data received
        timeout: 5000 // 5 seconds
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}

// Initialize the map and set the view
const map = L.map('Map').setView([0, 0], 2); // Changed 'map' to 'Map' to match the ID in the HTML

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap',
}).addTo(map);

const markers = {};

socket.on('location-received', (data) => {
    const { id, lat, lon } = data;
    console.log(`Location received: ID=${id}, Latitude=${lat}, Longitude=${lon}`);
    map.setView([lat, lon], 16);
    if (markers[id]) {
        markers[id].setLatLng([lat, lon]);
    } else {
        markers[id] = L.marker([lat, lon]).addTo(map);
    }
});

socket.on('client-disconnected', (data) => {
    const { id } = data;
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
