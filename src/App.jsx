import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useRef, useState } from "react";

function App() {
  const [weatherArr, setWeatherArr] = useState([]);
  const [cities, setCities] = useState([]);
  const appId = "f6a0f36fb383472394974653240409";
  const city = useRef(null);

  function setTimePeriod(time) {
    let oldTime = time.slice(10, 13);
    let timeAfterSet = null;
    if (oldTime.includes("00")) {
      return (timeAfterSet = time.slice(0, 11) + `12${time.slice(13)} AM`);
    } else if (oldTime.includes("12")) {
      return (time = time + " PM");
    } else if (oldTime > 12) {
      return (timeAfterSet =
        time.slice(0, 11) + (oldTime % 12) + time.slice(13) + " PM");
    } else {
      return (timeAfterSet = time + " AM");
    }
  }

  function manageWeatherIcon(weatherInfo) {
    if (weatherInfo.includes("rain")) {
      return <i className="icon fa-solid fa-cloud-rain"></i>;
    } else if (weatherInfo.includes("smog")) {
      return <i className="icon fa-solid fa-smog"></i>;
    } else if (weatherInfo.includes("clouds")) {
      return <i className="icon fa-solid fa-cloud"></i>;
    } else if (weatherInfo.includes("sunny")) {
      return <i className="icon fa-solid fa-sun"></i>;
    } else if (weatherInfo.includes("clear")) {
      return <i className="icon fa-solid fa-moon"></i>;
    } else {
      return <i className="icon fa-solid fa-cloud"></i>;
    }
  }

  function getWeather(e) {
    e.preventDefault();
    const currCity = city.current.value;

    if (cities.includes(currCity)) {
      alert("City already searched");
      return;
    }

    setCities([...cities, currCity]);

    axios(
      `https://api.weatherapi.com/v1/current.json?key=${appId}&q=${currCity}&aqi=yes`
    )
      .then((res) => {
        setWeatherArr([res.data, ...weatherArr]);
      })
      .catch((err) => {
        alert("City Not Correct, Please Enter Correct City");
        console.log(err);
      });

    city.current.value = "";
  }

  return (
    <div className="container">
      <nav className="navbar">
        <a href="/" className="navbar-brand">Weather App</a>
      </nav>
      <div className={weatherArr.length > 0 ? "weather-container" : "weather-full"}>
        <h1 className="heading">Welcome to the Weather App</h1>
        <form onSubmit={getWeather} className="form">
          <input
            type="text"
            ref={city}
            placeholder="Enter city name"
            className="input"
          />
          <button type="submit" className="btn">Search</button>
        </form>
        {weatherArr.length > 0 && (
          <>
            {weatherArr.map((weather, index) => {
              const {
                location: { name, country, localtime },
                current: {
                  temp_c,
                  feelslike_c,
                  wind_kph,
                  condition: { icon, text },
                },
              } = weather;
              return (
                <div key={index} className="weather-card">
                  <h2 className="time">{setTimePeriod(localtime)}</h2>
                  <div className="weather-details">
                    <div className="info">
                      <h2>
                        {name}, {country}
                      </h2>
                      <p>Temperature: {temp_c}°C</p>
                      <p>Feels like: {feelslike_c}°C</p>
                      <p>Wind Speed: {wind_kph} km/h <i className="fa-solid fa-wind"></i></p>
                      <p>{text} <img src={icon} alt={text} /></p>
                    </div>
                    <div className="weather-icon">{manageWeatherIcon(text)}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
