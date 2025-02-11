import { useState, useEffect, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HourWeather, LiveWeather, City } from "./types";
import ResultItem from "./components/ResultItem";
import WeatherListItem from "./components/WeatherListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import LiveWeatherDisplay from "./components/LiveWeatherDisplay";
import Footer from "./components/Footer";

function App() {
  const defaultCities: City[] = [
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
  ];

  const [currentData, setCurrentData] = useState<HourWeather[]>([]);
  const [liveData, setLiveData] = useState<LiveWeather | null>(null);
  const [uniqueDays, setUniqueDays] = useState<string[]>([]);
  const [matchedCities, setMatchedCities] = useState<City[]>([]);
  const [cityQuery, setCityQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>(
    defaultCities[0]
  );
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const cityButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dayButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [savedCities, setSavedCities] = useState<City[]>([]);

  useEffect(() => {
    const cities = localStorage.getItem("savedCities");
    if (cities && JSON.parse(cities)) {
      setSavedCities(JSON.parse(cities));
    } else {
      setSavedCities(defaultCities);
    }
  }, []);

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
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.latitude}&longitude=${selectedCity?.longitude}&current=temperature_2m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&timezone=auto&current=apparent_temperature&wind_speed_unit=mph&precipitation_unit=inch`
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
    scrollToButton(0, dayButtonRefs);
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
    let day_high: number = -500;
    let day_low: number = 500;

    // store hourly data
    if (data.hourly && data.hourly.time.length > 0) {
      for (let i = 0; i < data.hourly.time.length; i++) {
        weather.push({
          date: new Date(data.hourly.time[i]),
          temperature: data.hourly.temperature_2m[i],
          precip_prob: data.hourly.precipitation_probability[i],
          precip_inches: data.hourly.precipitation[i],
          wind_speed: data.hourly.wind_speed_10m[i],
          wind_direction: data.hourly.wind_direction_10m[i],
          weather_code: data.hourly.weather_code[i],
        });
        if (i < 24) {
          // current day
          day_high = Math.max(day_high, data.hourly.temperature_2m[i]);
          day_low = Math.min(day_low, data.hourly.temperature_2m[i]);
        }
      }
    }

    let liveWeather: LiveWeather | null = null;
    // store live data
    if (data.current) {
      liveWeather = {
        temperature: data.current.temperature_2m,
        temp_high: day_high,
        temp_low: day_low,
        temp_feels: data.current.apparent_temperature,
        weather_code: data.current.weather_code,
        utc_offset_seconds: data.utc_offset_seconds,
      }
    }

    setLiveData(liveWeather);
    setCurrentData(weather);
    scrollToButton(selectedCityIndex, cityButtonRefs);
  }

  function addCity(city: City) {
    let cities = [...savedCities];
    cities.push(city);
    setSavedCities(cities);
    setSelectedCity(city);
    setSelectedCityIndex(cities.length - 1);
    setCityQuery("");
    localStorage.setItem("savedCities", JSON.stringify(cities));
  }

  function scrollToButton(
    index: number,
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>
  ) {
    const button = buttonRefs.current[index];
    if (button) {
      button.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  function handleDeleteCity(index: number) {
    const isConfirmed = window.confirm(
      `Are you sure you want to remove ${savedCities[index].name}?`
    );
    if (isConfirmed) {
      let cities: City[] = [
        ...savedCities.slice(0, index),
        ...savedCities.slice(index + 1),
      ];
      setSavedCities(cities);
      if (selectedCityIndex == index) {
        setSelectedCityIndex(0);
        setSelectedCity(cities[0]);
      }
      if (cities.length < 1) {
        localStorage.removeItem("savedCities");
      } else {
        localStorage.setItem("savedCities", JSON.stringify(cities));
      }
    }
  }

  return (
    <div className="weather-app">
      <h1 className="display-2" style={{ padding: "4px", display: "flex", justifyContent: "center" }}>
        🌥️ SwiftWeather
      </h1>
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
            border: "0.5px solid #808080",
          }}
        />
        {matchedCities.map((city: City) => {
          return <ResultItem city={city} addCity={addCity} />;
        })}
      </div>

      <div className="button-list">
        {savedCities.map((city: City, index: number) => {
          return (
            <button
              key={index}
              onClick={() => {
                setSelectedCity(city);
                setSelectedCityIndex(index);
                scrollToButton(index, cityButtonRefs);
              }}
              style={{
                backgroundColor:
                  index === selectedCityIndex ? "#949494" : "lightgray",
              }}
              ref={(el) => (cityButtonRefs.current[index] = el)}
            >
              <FontAwesomeIcon
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the button's click event
                  handleDeleteCity(index);
                }}
                icon={faTrash}
              />
              &nbsp;&nbsp;{city.name}
            </button>
          );
        })}
      </div>
      
      {liveData && selectedCity ? <LiveWeatherDisplay weather={liveData} cityName={selectedCity.name}/> : <></>}
  
      <div className="button-list">
        {savedCities.length > 0 ? (
          uniqueDays.map((day: string, index: number) => (
            <button
              key={index}
              style={{
                backgroundColor: day == selectedDay ? "#949494" : "lightgray",
              }}
              onClick={() => {
                setSelectedDay(day);
                scrollToButton(index, dayButtonRefs);
              }}
              ref={(el) => (dayButtonRefs.current[index] = el)}
            >
              {day}
            </button>
          ))
        ) : (
          <></>
        )}
      </div>
      {currentData
        ?.filter(
          (data: HourWeather) =>
            data.date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }) == selectedDay
        )
        .map((hour: HourWeather, index: number) => (
          <WeatherListItem weather={hour} key={index} />
        ))}
      <Footer/>
    </div>
  );
}

export default App;
