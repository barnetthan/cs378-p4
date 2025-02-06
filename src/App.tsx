import { useState, useEffect, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HourWeather, City } from "./types";
import ResultItem from "./components/ResultItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import WeatherListItem from "./components/WeatherListItem";

function App() {
  const [currentData, setCurrentData] = useState<HourWeather[]>([]);
  const [uniqueDays, setUniqueDays] = useState<string[]>([]);
  const [matchedCities, setMatchedCities] = useState<City[]>([]);
  const [cityQuery, setCityQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>();
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(-1);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const cityButtonRefs = useRef<(HTMLButtonElement | null)[]>([]); // Ref for each city's button
  const dayButtonRefs = useRef<(HTMLButtonElement | null)[]>([]); // Ref for each day's button
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
      `https://api.open-meteo.com/v1/forecast?latitude=${savedCities[0]?.latitude}&longitude=${savedCities[0]?.longitude}&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&timezone=auto&current=apparent_temperature&wind_speed_unit=mph&precipitation_unit=inch`
    )
      .then((response) => response.json())
      .then((data) => storeWeatherResults(data))
      .catch((error) => console.error("Error fetching data:", error));
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
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.latitude}&longitude=${selectedCity?.longitude}&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&timezone=auto&current=apparent_temperature&wind_speed_unit=mph&precipitation_unit=inch`
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
    if (data.hourly && data.hourly.time.length > 0) {
      for (let i = 0; i < data.hourly.time.length; i++) {
        weather.push({
          date: new Date(data.hourly.time[i]),
          temperature: data.hourly.temperature_2m[i],
          precip_prob: data.hourly.precipitation_probability[i],
          precip_inches: data.hourly.precipitation[i],
          wind_speed: data.hourly.wind_speed_10m[i],
          wind_direction: data.hourly.wind_direction_10m[i],
        });
      }
    }
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

  return (
    <>
      <h1 style={{ padding: "4px", display: "flex", justifyContent: "center" }}>
        Weather App
      </h1>
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
        {uniqueDays.map((day: string, index: number) => (
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
        ))}
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
    </>
  );
}

export default App;
