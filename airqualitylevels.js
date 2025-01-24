function renderAirQualityLevels() {
    const levels = [
      { range: '0 - 50', level: 'Good' },
      { range: '51 - 100', level: 'Moderate' },
      { range: '101 - 150', level: 'Unhealthy for Sensitive Groups' },
      { range: '151 - 200', level: 'Unhealthy' },
      { range: '201 - 300', level: 'Very Unhealthy' },
      { range: '301 and higher', level: 'Hazardous' },
    ];
  
    let tableHTML = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Air Quality Levels</h5>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" class="font-weight-bold">AQI Range</th>
                <th scope="col" class="font-weight-bold">Level of Health Concern</th>
              </tr>
            </thead>
            <tbody>
    `;
  
    levels.forEach(({ range, level }) => {
      tableHTML += `
        <tr>
          <td class="font-weight-bold">${range}</td>
          <td class="font-weight-bold">${level}</td>
        </tr>
      `;
    });
  
    tableHTML += `
            </tbody>
          </table>
        </div>
      </div>
    `;
  
    document.getElementById('airQualityLevelsContainer').innerHTML = tableHTML;
  }
  