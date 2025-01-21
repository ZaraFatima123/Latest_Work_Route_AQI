const apiKey = '5b3ce3597851110001cf624804acb333d67c4cef8d421b8c0c543346';  // Replace with your OpenRouteService API key
const map = L.map('map').setView([28.6139, 77.2090], 12);  // Centered on Delhi

// Adding OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Function to get routes from OpenRouteService
async function getRoute(start, end, mode) {
    const url = `https://api.openrouteservice.org/v2/directions/${mode}?api_key=${apiKey}&start=${start}&end=${end}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.features) {
            alert("No route found. Please check your coordinates.");
            return;
        }

        const coordinates = data.features[0].geometry.coordinates;
        
        // Converting coordinates for Leaflet (lat, lon)
        const routeLine = L.polyline(coordinates.map(coord => [coord[1], coord[0]]), {
            color: 'blue'
        }).addTo(map);

        map.fitBounds(routeLine.getBounds());
    } catch (error) {
        console.error('Error fetching route:', error);
        alert('Error fetching route. Please check your API key and input.');
    }
}

// Event listener for the button click
document.getElementById('find-routes-btn').addEventListener('click', () => {
    const start = document.getElementById('location-input').value;
    const end = document.getElementById('destination-input').value;
    const mode = document.getElementById('transport-mode').value;
    
    getRoute(start, end, mode);
});
