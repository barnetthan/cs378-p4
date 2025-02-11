import { LiveWeatherDisplayProps } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TimeDisplay from "./TimeDisplay";
import { getWeatherIcon } from "../weatherIconMap";

function LiveWeatherDisplay({ weather, cityName }: LiveWeatherDisplayProps) {

  return (
    <div
      className="text-center container"
      style={{ borderTop: "0.5px solid #808080" }}
    >
      <h1 className="display-1">{cityName} </h1>
      <div className="d-flex align-items-center justify-content-center">
        <h1 className="display-2 me-4">
          <FontAwesomeIcon icon={getWeatherIcon(weather.weather_code).icon} />{" "}
          {weather.temperature}° F
        </h1>
        <div>
          <div>High: {weather.temp_high}° F</div>
          <div>Low: {weather.temp_low}° F</div>
        </div>
      </div>

      <div className="fs-5">
        <TimeDisplay utc_offset_seconds={weather.utc_offset_seconds} /> | Feels
        like {weather.temp_feels}° F
      </div>
    </div>
  );
}

export default LiveWeatherDisplay;
