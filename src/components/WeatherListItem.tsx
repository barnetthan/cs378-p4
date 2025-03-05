import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HourWeather } from "../types";
import {
  faArrowDown,
  faDroplet,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

function WeatherListItem({ weather }: { weather: HourWeather }) {
  return (
    <div
      className="container"
      style={{ borderTop: "0.5px solid #808080", padding: "8px" }}
    >
      <div className="row align-items-center">
        <div className="col-3">
          <h6 style={{ paddingLeft: "8px" }}>
            {weather.date.toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            })}
          </h6>
        </div>
        <div className="row align-items-center col-9 text-center p-0">
          <div className="col-6 text-center p-0">
            <h3 className="display-6">
               {weather.temperature}° F
            </h3>
          </div>
          <div className="col-6 text-center p-0">
            <div className="text-center">
              <FontAwesomeIcon icon={faWind} style={{ color: "#696969" }} />{" "}
              {weather.wind_speed} mph &nbsp;
              <FontAwesomeIcon
                icon={faArrowDown}
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
