function getCardColor(aqi) {
    if (aqi <= 50) return 'bg-success text-white';
    if (aqi <= 100) return 'bg-warning';
    if (aqi <= 150) return 'bg-orange';
    if (aqi <= 200) return 'bg-danger text-white';
    if (aqi <= 300) return 'bg-very-unhealthy text-white';
    return 'bg-hazardous text-white';
  }
  
  function renderAirQualityCard(data) {
    const { aqi, city, dominentpol, time } = data;
    const cardColor = getCardColor(aqi);
  
    const cardHTML = `
      <div class="card mb-4 ${cardColor}">
        <div class="card-body">
          <h5 class="card-title">${city.name}</h5>
          <h6 class="card-subtitle mb-2">Air Quality Index: ${aqi}</h6>
          <p class="card-text">Dominant Pollutant: ${dominentpol}</p>
          <p class="card-text">Last Updated: ${time.s}</p>
        </div>
      </div>
    `;
  
    document.getElementById('airQualityCardContainer').innerHTML = cardHTML;
  }
  