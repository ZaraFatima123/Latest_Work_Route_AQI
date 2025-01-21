document.addEventListener('DOMContentLoaded', function () {
    const findRoutesButton = document.getElementById('find-routes-btn');
    const locationInput = document.getElementById('location-input');
    const destinationInput = document.getElementById('destination-input');
    const transportModeSelect = document.getElementById('transport-mode');
    const routesInfo = document.getElementById('routes-info');

    const apiKey = '5b3ce3597851110001cf624804acb333d67c4cef8d421b8c0c543346';

    const weatherApiKey = '3af302ef713eeedc6b5d97ad71cc2373';

async function getWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return `Weather: ${data.weather[0].description}, Temp: ${data.main.temp}°C`;
}


    findRoutesButton.addEventListener('click', function () {
        let location = locationInput.value.trim();
        let destination = destinationInput.value.trim();
        const transportMode = transportModeSelect.value;
    
        if (location === '' || destination === '') {
            alert('Please enter both starting location and destination.');
            return;
        }
    
        const [startLatitude, startLongitude] = location.split(',').map(coord => parseFloat(coord.trim()));
        const [endLatitude, endLongitude] = destination.split(',').map(coord => parseFloat(coord.trim()));
    
        // Check for valid numbers
        if (isNaN(startLatitude) || isNaN(startLongitude) || isNaN(endLatitude) || isNaN(endLongitude)) {
            alert('Invalid coordinates. Please enter valid numbers for both locations.');
            return;
        }
    
        displayRoutes(startLongitude, startLatitude, endLongitude, endLatitude, transportMode);
    });
    
    async function displayRoutes(startLongitude, startLatitude, endLongitude, endLatitude, transportMode) {
        const apiUrl = `https://api.openrouteservice.org/v2/directions/${transportMode}?api_key=${apiKey}&start=${startLongitude},${startLatitude}&end=${endLongitude},${endLatitude}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            const data = await response.json();
    
            if (data.features && data.features.length > 0) {
                const route = data.features[0].properties.segments[0];
                routesInfo.innerHTML = `<p>Route found! Distance: ${route.distance / 1000} km, Duration: ${route.duration / 60} minutes.</p>`;
            } else {
                routesInfo.innerHTML = '<p class="text-warning">No routes found for the selected location and transport mode.</p>';
            }
        } catch (error) {
            console.error('Error fetching routes:', error);
            routesInfo.innerHTML = `<p class="text-danger">Error fetching routes: ${error.message}</p>`;
        }
    }
});
