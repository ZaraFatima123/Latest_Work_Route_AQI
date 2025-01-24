// PollutantInfo.js
export const getPollutantInfo = (pollutant) => {
    switch (pollutant) {
      case 'pm25':
        return 'PM2.5 are tiny particles in the air that reduce visibility and cause the air to appear hazy when levels are elevated. They result from burning fossil fuels and chemical reactions.';
      case 'pm10':
        return 'PM10 are inhalable particles that penetrate the respiratory system. They originate from road dust, wood burning, and industrial activities.';
      case 'o3':
        return 'Ozone (O3) is a gas that occurs both in the Earth\'s upper atmosphere and at ground level. It can impact health and the environment depending on its location.';
      case 'no2':
        return 'Nitrogen Dioxide (NO2) enters the air primarily from burning fuel. It can cause respiratory issues and contribute to other pollutants.';
      case 'so2':
        return 'Sulfur Dioxide (SO2) is produced from burning fossil fuels and smelting mineral ores. It causes respiratory issues and contributes to acid rain.';
      case 'co':
        return 'Carbon Monoxide (CO) is a harmful pollutant from car exhausts. It is colorless, odorless, and can cause health problems at high levels.';
      default:
        return 'No information available for this pollutant.';
    }
  };
  
  // Render the Pollutant Info
  export const PollutantInfo = (pollutant) => {
    const pollutantDescription = getPollutantInfo(pollutant);
  
    return `
      <div class="card mb-4">
        <div class="card-body">
          <h4 class="card-title">${pollutant.toUpperCase()} Information</h4>
          <p>${pollutantDescription}</p>
        </div>
      </div>
    `;
  };
  