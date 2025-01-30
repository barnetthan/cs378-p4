import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HourWeather, City } from "./types";

function App() {
  const [currentData, setCurrentData] = useState<HourWeather[] | null>([]);
  const [matchedCities, setMatchedCities] = useState<City[]>([]);
  const [cityQuery, setCityQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>();
  const [savedCities, setSavedCities] = useState<City[]>([
    {
      name: "Austin",
      state: "Texas",
      country: "United States",
      latitude: 30.2672,
      longitude: -97.7431,
    },
    {
      name: "Dallas",
      state: "Texas",
      country: "United States",
      latitude: 32.7767,
      longitude: -96.797,
    },
    {
      name: "Houston",
      state: "Texas",
      country: "United States",
      latitude: 29.7601,
      longitude: -95.3701,
    },
  ]);

  useEffect(() => {
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityQuery}&count=10&language=en&format=json`
    )
      .then((response) => response.json())
      .then((data) => storeCityResults(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [cityQuery]);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.latitude}&longitude=${selectedCity?.longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto`
    )
      .then((response) => response.json())
      .then((data) => storeWeatherResults(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedCity]);

  function storeCityResults(data: any) {
    let cities: City[] = [];
    if (data.results && data.results.length > 0) {
      for (let i = 0; i < data.results.length; i++) {
        cities.push({
          name: data.results[i].name,
          state: data.results[i].admin1,
          country: data.results[i].country,
          latitude: data.results[i].latitude,
          longitude: data.results[i].longitude,
        });
      }
    }
    setMatchedCities(cities);
  }

  function storeWeatherResults(data: any) {
    let weather: HourWeather[] = [];
    if (data.hourly && data.hourly.time.length > 0) {
      for (let i = 0; i < data.hourly.time.length; i++) {
        weather.push({
          date: new Date(data.hourly.time[i]),
          temperature: data.hourly.temperature_2m[i],
        });
      }
    }
    setCurrentData(weather);
  }

  function addCity(city: City) {
    let cities = [...savedCities];
    cities.push(city);
    setSavedCities(cities);
  }

  return (
    <>
      <h1>Weather App</h1>
      <h1>Selected City: {selectedCity?.name}</h1>
      <div style={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap" }}>
        {savedCities.map((city) => {
          return (
            <>
              <button
                className="mx-1 my-2"
                onClick={() => {
                  setSelectedCity(city);
                }}
              >
                {city.name}
              </button>
            </>
          );
        })}
      </div>
      Search for a city to add:
      <input
        type="text"
        value={cityQuery}
        onChange={(e) => {
          setCityQuery(e.target.value);
        }}
      />
      <div>
        {matchedCities.map((city: City) => {
          return (
            <div className="d-flex align-items-center">
              {city.name}, {city.state ? `${city.state}, ` : ""} {city.country}
              <button
                className="btn btn-s"
                onClick={() => {
                  addCity(city);
                }}
              >
                +
              </button>
            </div>
          );
        })}
      </div>
      <div>
        {currentData?.map((hour: HourWeather) => {
          return (
            <div>
              {hour.date.toDateString()}, {hour.date.toLocaleTimeString()},{" "}
              {hour.temperature} F
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
