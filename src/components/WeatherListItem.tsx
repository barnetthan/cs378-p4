import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WeatherListItemProps } from "../types";
import {
  faArrowUp,
  faDroplet,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

function WeatherListItem({ weather }: WeatherListItemProps) {
  return (
    <div
      className="container"
      style={{ borderTop: "1px solid lightgray", padding: "8px" }}
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
        <div className="row align-items-center col-9 text-center">
          <div className="col-5 text-center">
            <h2>{weather.temperature}° F</h2>
          </div>
          <div className="col-7 text-center">
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
              <FontAwesomeIcon icon={faDroplet} style={{ color: "#74C0FC" }} />
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
