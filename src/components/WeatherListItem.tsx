import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WeatherListItemProps } from "../types";
import {
  faArrowUp,
  faDroplet,
  faQuestionCircle,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import weatherIconMap from "../weatherIconMap";

const getWeatherIcon = (code: number) => {
  let bestMatch = { description: "Unknown", icon: faQuestionCircle };

  for (const key of Object.keys(weatherIconMap).map(Number).sort((a, b) => a - b)) {
    if (code >= key) {
      bestMatch = weatherIconMap[key]; // Update with the best match so far
    } else {
      break; // Stop once we exceed the number
    }
  }

  return bestMatch;
};

function WeatherListItem({ weather }: WeatherListItemProps) {
  return (
    <div
      className="container"
      style={{ borderTop: "0.5px solid #808080", padding: "8px" }}
    >
      <div className="row align-items-center">
        <div className="col-3">
          <h6 style={{paddingLeft: "8px"}}>
            {weather.date.toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            })}
          </h6>
        </div>
        <div className="row align-items-center col-9 text-center p-0">
          <div className="col-6 text-center p-0">
            <h3><FontAwesomeIcon icon={getWeatherIcon(weather.weather_code).icon} /> {weather.temperature}° F</h3>
          </div>
          <div className="col-6 text-center p-0">
            <div className="text-center">
              <FontAwesomeIcon icon={faWind} style={{ color: "#696969" }} />{" "}
              {weather.wind_speed} mph &nbsp;
              <FontAwesomeIcon
                icon={faArrowUp}
                style={{
                  transform: `rotate(${weather.wind_direction}deg)`,
                  fontSize: "16px",
                }}
              />
            </div>
            <div>
              <FontAwesomeIcon icon={faDroplet} style={{ color: "#5050f0" }} />
              &nbsp;
              {weather.precip_prob}% | {weather.precip_inches}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherListItem;
