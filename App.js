const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const errorMsg = document.getElementById('errorMsg');
const pollutantInfo = document.getElementById('pollutantInfo');
const pollutantDescription = document.getElementById('pollutantDescription');

const getPollutantDescription = (pollutant) => {
  const descriptions = {
    pm25: 'Fine particles smaller than 2.5 micrometers. Can cause respiratory issues.',
    pm10: 'Larger particles that can cause breathing discomfort.',
    o3: 'Ozone. Can cause throat irritation and asthma.',
    no2: 'Nitrogen Dioxide. Affects lung function and increases respiratory problems.',
    so2: 'Sulfur Dioxide. Causes eye irritation and respiratory symptoms.',
    co: 'Carbon Monoxide. Reduces oxygen delivery to organs and tissues.',
  };
  return descriptions[pollutant] || 'No information available for this pollutant.';
};

const fetchAirQuality = async (city) => {
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/${city}/?token=28644e2f12c93d1b427b539c4907f9db1a8cae14`
    );
    const data = await response.json();

    if (response.ok && data.status === 'ok') {
      renderAirQualityCard(data.data);
      pollutantInfo.style.display = 'block';
      pollutantDescription.textContent = getPollutantDescription(data.data.dominentpol);
      errorMsg.style.display = 'none';
    } else {
      errorMsg.textContent =
        "Sorry, we couldn't find the city you were looking for. Try another location nearby or ensure your spelling is correct.";
      errorMsg.style.display = 'block';
      pollutantInfo.style.display = 'none';
    }
  } catch (error) {
    console.error('Network error:', error);
    errorMsg.textContent = 'Sorry, something went wrong.';
    errorMsg.style.display = 'block';
  }
};

searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchAirQuality(city);
  }
});

renderAirQualityLevels();
