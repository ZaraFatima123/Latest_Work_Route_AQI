// Initialize Map
var map = L.map('map').setView([28.6139, 77.2090], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

document.getElementById('find-routes-btn').addEventListener('click', function () {
    const startLocation = document.getElementById('location-input').value.split(',');
    const endLocation = document.getElementById('destination-input').value.split(',');

    if (startLocation.length == 2 && endLocation.length == 2) {
        const startLat = parseFloat(startLocation[0].trim());
        const startLon = parseFloat(startLocation[1].trim());
        const endLat = parseFloat(endLocation[0].trim());
        const endLon = parseFloat(endLocation[1].trim());

        // Fetch route data using OpenRouteService API
        fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624804acb333d67c4cef8d421b8c0c543346&start=${startLon},${startLat}&end=${endLon},${endLat}`)
            .then(response => response.json())
            .then(data => {
                const coordinates = data.features[0].geometry.coordinates;
                const distance = (data.features[0].properties.segments[0].distance / 1000).toFixed(1);
                const duration = (data.features[0].properties.segments[0].duration / 60).toFixed(1);

                // Update route summary
                document.getElementById('route-summary').innerHTML = `
                    <strong>Total Distance:</strong> ${distance} km<br/>
                    <strong>Estimated Time:</strong> ${duration} min
                `;

                // Add the route to the map
                const route = coordinates.map(coord => [coord[1], coord[0]]);
                L.polyline(route, { color: 'blue' }).addTo(map);
                map.fitBounds(route);

                // Fetch AQI for key waypoints (start, midpoint, end)
                const waypoints = [route[0], route[Math.floor(route.length / 2)], route[route.length - 1]]; // Start, midpoint, end
                waypoints.forEach((point, index) => {
                    const lat = point[0];
                    const lon = point[1];

                    // Fetch AQI data from AQICN API for each waypoint
                    fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=28644e2f12c93d1b427b539c4907f9db1a8cae14`)
                        .then(aqiResponse => aqiResponse.json())
                        .then(aqiData => {
                            if (aqiData.status === 'ok') {
                                const aqi = aqiData.data.aqi;
                                const city = aqiData.data.city.name;
                                const quality = getAQIDescription(aqi);

                                // Add AQI marker on the map for each waypoint
                                L.circleMarker([lat, lon], {
                                    radius: 10,
                                    color: getAQIColor(aqi),
                                    fillColor: getAQIColor(aqi),
                                    fillOpacity: 0.5
                                }).addTo(map).bindPopup(`
                                    <b>${city}</b><br/>
                                    AQI: ${aqi} (${quality})
                                `);

                                // Update the summary for each waypoint
                                document.getElementById('route-summary').innerHTML += `
                                    <strong>Waypoint ${index + 1} (${city}):</strong> AQI ${aqi} (${quality})<br/>
                                `;
                            } else {
                                console.error(`Failed to fetch AQI for waypoint ${index + 1}`);
                            }
                        });
                });
            })
            .catch(err => console.error('Error fetching route or AQI:', err));
    } else {
        alert('Please enter valid start and destination coordinates in "latitude,longitude" format.');
    }
});

// Helper Function: Get AQI Quality Description
function getAQIDescription(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

// Helper Function: Get AQI Color
function getAQIColor(aqi) {
    if (aqi <= 50) return 'green'; // Good
    if (aqi <= 100) return 'yellow'; // Moderate
    if (aqi <= 150) return 'orange'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return 'red'; // Unhealthy
    if (aqi <= 300) return 'purple'; // Very Unhealthy
    return 'brown'; // Hazardous
}
