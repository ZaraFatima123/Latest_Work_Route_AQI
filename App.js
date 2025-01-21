const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")

const appId = "3af302ef713eeedc6b5d97ad71cc2373" // Ensure API key is correct
const link = "https://api.openweathermap.org/data/2.5/air_pollution" // Corrected endpoint

const getUserLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "Can't Access your location. Please enter your coordinates." })
	}
}

const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4)
	let lon = pos.coords.longitude.toFixed(4)

	latInp.value = lat
	lonInp.value = lon

	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	try {
		const response = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`)
		if (!response.ok) throw new Error("Failed to fetch data. Check API key or location.")
		
		const airData = await response.json()
		setValuesOfAir(airData)
		setComponentsOfAir(airData)
	} catch (error) {
		onPositionGatherError({ message: error.message })
	}
}

const setValuesOfAir = (airData) => {
	const aqi = airData.list[0].main.aqi
	let airStat = "", color = ""

	switch (aqi) {
		case 1: airStat = "Good";
        color = "rgb(19, 201, 28)"; 
        imgSrc = "C:/Users/ahmad/OneDrive/Desktop/XXXX/giphy_sun_simile.gif";
         break
		case 2: airStat = "Moderate";
         color = "rgb(15, 134, 25)";
         imgSrc = "C:/Users/ahmad/OneDrive/Desktop/XXXX/giphy_sun_simile.gif"; 
         break
		case 3: airStat = "Unhealthy for Sensitive Groups"; 
        color = "rgb(201, 204, 13)"; 
        imgSrc = "C:/Users/ahmad/OneDrive/Desktop/XXXX/giphy_sun_simile.gif";
        break
		case 4: airStat = "Unhealthy"; color = "rgb(204, 83, 13)"; break
		case 5: airStat = "Very Unhealthy"; color = "rgb(204, 13, 13)"; break
		default: airStat = "Hazardous"
	}

	airQuality.innerText = aqi
	airQualityStat.innerText = airStat
	airQualityStat.style.color = color
}

const setComponentsOfAir = (airData) => {
	const components = airData.list[0].components
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] + " μg/m³"
	})
}

const onPositionGatherError = (error) => {
	errorLabel.innerText = error.message
}

srchBtn.addEventListener("click", () => {
	const lat = parseFloat(latInp.value).toFixed(4)
	const lon = parseFloat(lonInp.value).toFixed(4)
	if (lat && lon) {
		getAirQuality(lat, lon)
	} else {
		errorLabel.innerText = "Please enter valid coordinates."
	}
})

const aboutLink = document.getElementById('aboutLink');
const aboutSection = document.getElementById('about');






getUserLocation()
