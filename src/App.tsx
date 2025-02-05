import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HourWeather, City } from "./types";
import ResultItem from "./components/ResultItem";

function App() {
  const [currentData, setCurrentData] = useState<HourWeather[]>([]);
  const [uniqueDays, setUniqueDays] = useState<string[]>([]);
  const [matchedCities, setMatchedCities] = useState<City[]>([]);
  const [cityQuery, setCityQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>();
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(-1);
  const [selectedDay, setSelectedDay] = useState<string>("");
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
    setSelectedCityIndex(0);
    setSelectedCity(savedCities[0]);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${savedCities[0]?.latitude}&longitude=${savedCities[0]?.longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto`
    )
      .then((response) => response.json())
      .then((data) => storeWeatherResults(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [])

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

  useEffect(() => {
    if (!currentData || currentData.length == 0) {
      return;
    }
    let days = new Set<string>();
    for (const data of currentData!) {
      days.add(
        data.date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    }
    setUniqueDays(Array.from(days));
    setSelectedDay(Array.from(days)[0]);
  }, [currentData]);

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
    setSelectedCity(city);
    setSelectedCityIndex(cities.length - 1);
    setCityQuery("");
  }

  return (
    <>
      <h1 style={{padding: "4px", display: "flex", justifyContent: "center"}}>Weather App</h1>
      <div className="button-list">
        {savedCities.map((city: City, index: number) => {
          return (
            <button
              key={index}
              className=""
              onClick={() => {
                setSelectedCity(city);
                setSelectedCityIndex(index);
              }}
              style={{
                backgroundColor:
                  index === selectedCityIndex ? "#2980b9" : "lightgray",
              }}
            >
              {city.name}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "0px 4px 4px 8px" }}>Add City:</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          className="form-control"
          type="text"
          value={cityQuery}
          placeholder="Search for a city..."
          onChange={(e) => {
            setCityQuery(e.target.value);
          }}
          style={{
            width: "95%",
          }}
        />
        {matchedCities.map((city: City) => {
          return <ResultItem city={city} addCity={addCity} />;
        })}
      </div>
      <div className="button-list">
        {uniqueDays.map((day: string) => (
          <button
            style={{
              backgroundColor: day == selectedDay ? "#2980b9" : "lightgray",
            }}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="container">
        <div className="row">
          <div className="col-6 text-center">
            {currentData.length > 0 ? <h5>Time</h5> : <></>}
            {currentData
              ?.filter(
                (data: HourWeather) =>
                  data.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }) == selectedDay
              )
              .map((hour: HourWeather) => {
                return (
                  <div>
                    {hour.date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                );
              })}
          </div>
          <div className="col-6 text-center">
            <div>
              {currentData.length > 0 ? <h5>Temperature</h5> : <></>}
              {currentData
                ?.filter(
                  (data: HourWeather) =>
                    data.date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }) == selectedDay
                )
                .map((hour: HourWeather) => {
                  return <div>{hour.temperature} F</div>;
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
