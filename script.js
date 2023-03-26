const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-loctaion-container");
const searchForm = document.querySelector("[data-searchfrom]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
const errorScreen = document.querySelector(".error-container");

// variable need

let oldTab = userTab;
const API_KEY = "e6e826b4f9a5f9b88c882e8d45f62147";
oldTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove('current-tab');
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        if (!searchForm.classList.contains("active")) {
            // kya search from wala container invisible  hai if yes then visible it

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            errorScreen.classList.remove("active");

        }
        else {
            // main phale search wala tab par tha ab your weather wala tab para aana hoga eske liye search tab ko invisible karna hoga
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorScreen.classList.remove("active");

            // ab mai your weather tab me aaya hu to weather bhi display karna parega  so phale localStorage check karenge cordinates ke liye
            getfromSessionStorage();

        }

    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as a input
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as a input
    switchTab(searchTab);
});
// check cordinates hai ya nhi local storage
function getfromSessionStorage() {
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // agar localCoordinates nhi hai
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    //  make grant container invisible

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    


    //API CALL

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch (err) {
        //  loadingScreen.classList.remove("active");
        //  errorHandler.classList.add("active");
    }
}

// fetching data through api

function renderWeatherInfo(weatherInfo) {
    // firstly we fetch elemeent
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // console.log(weatherInfo);
    // we send the data in element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function showPosition(position) {
    const userCoordinates = {

        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Your browser does not support geolocation method : (");
        // yeha  ek alert dena hai
    }
}


grantAccessButton.addEventListener("click", getLocation);
searchForm.addEventListener("click", (e) => {

    e.preventDefault();

    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    }
    else {
        fetchSearchWeaatherInfo(cityName);
    }
})



async function fetchSearchWeaatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    if (errorScreen.classList.contains("active")) {
        errorScreen.classList.remove("active");
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        if (!response.ok) {
            throw (new error)
        }

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        errorScreen.classList.add("active");
        console.log("API Cannot fetched " + err);
    }
}

