// Initialize Map
var map = L.map('map').setView([28.6139, 77.2090], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Helper function: Get latitude and longitude for a city/state using TomTom API
async function getCoordinates(location) {
    const apiKey = 'OXProDFJdgWzcxg3SbJrXRNPiHhRt35y'; // Replace with your TomTom API key
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(location)}.json?key=${apiKey}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
            lat: result.position.lat,
            lon: result.position.lon
        };
    } else {
        throw new Error(`Location "${location}" not found.`);
    }
}

// Helper function: Get Weather information using OpenWeatherMap API
async function getWeather(lat, lon) {
    const apiKey = '3af302ef713eeedc6b5d97ad71cc2373'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.weather && data.main) {
        const weather = data.weather[0].description;
        const temperature = data.main.temp.toFixed(1);
        const humidity = data.main.humidity;
        return {
            weather: weather,
            temperature: temperature,
            humidity: humidity
        };
    } else {
        throw new Error('Weather data not found.');
    }
}

// Helper function: Get AQI Quality Description
function getAQIDescription(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

// Helper function: Get AQI Color
function getAQIColor(aqi) {
    if (aqi <= 50) return 'green'; // Good
    if (aqi <= 100) return 'yellow'; // Moderate
    if (aqi <= 150) return 'orange'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return 'red'; // Unhealthy
    if (aqi <= 300) return 'purple'; // Very Unhealthy
    return 'brown'; // Hazardous
}

// Helper function: Get Weather Color and Popup Background


// Helper function: Create a marker with pop-up for Weather info
// function createPopupContent(weatherCondition, weatherData) {
//     const { color, backgroundColor } = getWeatherColor(weatherCondition);

//     // Create a content for the pop-up
//     return `
//         <div style="background-color:${backgroundColor}; padding: 10px; border-radius: 5px;">
//             <b style="color:${color};">Weather Condition: ${weatherCondition}</b><br/>
//             Temperature: ${weatherData.temperature} °C<br/>
//             Humidity: ${weatherData.humidity}%<br/>
//             Windspeed: ${weatherData.windSpeed} m/s
//         </div>
//     `;
// }

// Helper function: Create a marker with pop-up for Weather info
// function createPopupContent(weatherCondition, weatherData) {
//     const { color, backgroundColor } = getWeatherColor(weatherCondition);

//     // Create a content for the pop-up
//     return `
//         <div style="background-color:${backgroundColor}; padding: 10px; border-radius: 5px;">
//             <b style="color:${color};">Weather Condition: ${weatherCondition}</b><br/>
//             Temperature: ${weatherData.temperature} °C<br/>
//             Humidity: ${weatherData.humidity}%<br/>
//             Windspeed: ${weatherData.windSpeed} m/s
//         </div>
//     `;
// }

function createPopupContent(weatherCondition, weatherData) {
    const { color, backgroundColor } = getWeatherColor(weatherCondition);

    // Create a content for the pop-up
    return `
        <div style="background-color:${backgroundColor}; padding: 10px; border-radius: 5px;">
            <b style="color:${color};">Weather Condition: ${weatherCondition}</b><br/>
            Temperature: ${weatherData.temperature} °C<br/>
            Humidity: ${weatherData.humidity}%<br/>
            Windspeed: ${weatherData.windSpeed} m/s
        </div>
    `;
}

// Helper function: Get Weather Color and Popup Background
function getWeatherColor(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return { color: 'green', backgroundColor: '#d4edda' }; // Clear Sky
        case 'cloudy':
            return { color: 'gray', backgroundColor: '#e2e2e2' }; // Cloudy
        case 'haze':
            return { color: 'yellow', backgroundColor: '#CC9A00' }; // Haze
        case 'rain':
            return { color: 'blue', backgroundColor: '#cce5ff' }; // Rain
        case 'fog':
            return { color: 'gray', backgroundColor: '#d6d6d6' }; // Fog
        case 'snow':
            return { color: 'white', backgroundColor: '#f8f9fa' }; // Snow
        default:
            return { color: 'black', backgroundColor: '#f1f1f1' }; // Default
    }
}

map.on('click', async function (event) {
    const lat = event.latlng.lat;
    const lon = event.latlng.lng;

    try {
        const weatherData = await getWeather(lat, lon);

        // Assuming 'weatherData.weather' contains the main weather condition (e.g., 'Clear', 'Haze', etc.)
        const weatherCondition = weatherData.weather;

        // Create a custom icon for the weather info
        const weatherIcon = L.divIcon({
            className: 'weather-icon',
            html: '<i class="fa fa-cloud-sun" style="font-size:24px; color:orange;"></i>',
            iconSize: [30, 30]
        });

        // Create marker with weather icon
        const weatherMarker = L.marker([lat, lon], { icon: weatherIcon }).addTo(map);

        // Add Weather info to the map as a pop-up with dynamic color
        const popupContent = createPopupContent(weatherCondition, weatherData);
        weatherMarker.bindPopup(popupContent).openPopup();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});


map.on('click', async function (event) {
    const lat = event.latlng.lat;
    const lon = event.latlng.lng;

    try {
        const weatherData = await getWeather(lat, lon);

        // Create a custom icon for the weather info
        const weatherIcon = L.divIcon({
            className: 'weather-icon',
            html: '<i class="fa fa-cloud-sun" style="font-size:24px; color:orange;"></i>',
            iconSize: [30, 30]
        });

        // Create marker with weather icon
        const weatherMarker = L.marker([lat, lon], { icon: weatherIcon }).addTo(map);

        // Create a pop-up message to display weather information
        const popupContent = `
            <b>Weather Info</b><br/>
            Description: ${weatherData.weather}<br/>
            Temperature: ${weatherData.temperature} °C<br/>
            Humidity: ${weatherData.humidity}%
        `;

        // Bind pop-up to the marker
        weatherMarker.bindPopup(popupContent);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
});

document.getElementById('find-routes-btn').addEventListener('click', async function () {
    const startLocation = document.getElementById('location-input').value.trim();
    const endLocation = document.getElementById('destination-input').value.trim();

    if (startLocation && endLocation) {
        try {
            // Get coordinates for the start and end locations using TomTom API
            const startCoords = await getCoordinates(startLocation);
            const endCoords = await getCoordinates(endLocation);

            // Fetch route data using OpenRouteService API
            fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624804acb333d67c4cef8d421b8c0c543346&start=${startCoords.lon},${startCoords.lat}&end=${endCoords.lon},${endCoords.lat}`)
                .then(response => response.json())
                .then(data => {
                    const coordinates = data.features[0].geometry.coordinates;
                    const distance = (data.features[0].properties.segments[0].distance / 1000).toFixed(1);
                    const duration = (data.features[0].properties.segments[0].duration / 60).toFixed(1);

                    // Update route summary
                    document.getElementById('route-summary').innerHTML = `
                        <strong>Start Location:</strong> ${startLocation} (${startCoords.lat.toFixed(4)}, ${startCoords.lon.toFixed(4)})<br/>
                        <strong>Destination:</strong> ${endLocation} (${endCoords.lat.toFixed(4)}, ${endCoords.lon.toFixed(4)})<br/>
                        <strong>Total Distance:</strong> ${distance} km<br/>
                        <strong>Estimated Time:</strong> ${duration} min<br/><br/>
                    `;

                    // Add the route to the map
                    const route = coordinates.map(coord => [coord[1], coord[0]]);
                    L.polyline(route, { color: 'blue' }).addTo(map);
                    map.fitBounds(route);

                    // Fetch AQI and Weather for key waypoints (start, midpoint, end)
                    const waypoints = [route[0], route[Math.floor(route.length / 2)], route[route.length - 1]]; // Start, midpoint, end
                    waypoints.forEach(async (point, index) => {
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

                                    // Fetch Weather data
                                    getWeather(lat, lon).then(weatherData => {
                                        const weatherDescription = weatherData.weather;
                                        const temperature = weatherData.temperature;
                                        const humidity = weatherData.humidity;

                                        // Add AQI marker and weather info on the map for each waypoint
                                        L.circleMarker([lat, lon], {
                                            radius: 10,
                                            color: getAQIColor(aqi),
                                            fillColor: getAQIColor(aqi),
                                            fillOpacity: 0.5
                                        }).addTo(map).bindPopup(`Waypoint ${index + 1}:<br/>
                                            <b>${city}</b><br/>
                                            Latitude: ${lat.toFixed(4)}<br/>
                                            Longitude: ${lon.toFixed(4)}<br/>
                                            AQI: ${aqi} (${quality})<br/>
                                            Weather: ${weatherDescription}<br/>
                                            Temperature: ${temperature}°C<br/>
                                            Humidity: ${humidity}%
                                        `);

                                        // Update the summary for each waypoint
                                        document.getElementById('route-summary').innerHTML += `
                                            <strong>Waypoint ${index + 1} (${city}):</strong><br/>
                                            Latitude: ${lat.toFixed(4)}<br/>
                                            Longitude: ${lon.toFixed(4)}<br/>
                                            AQI: ${aqi} (${quality})<br/>
                                            Weather: ${weatherDescription}<br/>
                                            Temperature: ${temperature}°C<br/>
                                            Humidity: ${humidity}%<br/>
                                        `;
                                    }).catch(error => console.error(`Failed to fetch weather for waypoint ${index + 1}:`, error));
                                } else {
                                    console.error(`Failed to fetch AQI for waypoint ${index + 1}`);
                                }
                            });
                    });
                })
                .catch(err => console.error('Error fetching route or AQI:', err));
        } catch (err) {
            alert(err.message);
        }
    } else {
        alert('Please enter valid city or state names for both start and destination.');
    }
});
