import { 
  faSun, 
  faCloudSun, 
  faCloud, 
  faSmog, 
  faWind, 
  faTornado, 
  faCloudShowersHeavy, 
  faCloudRain, 
  faSnowflake, 
  faCloudMeatball, 
  faBolt, 
  faCloudSunRain 
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const weatherIconMap: Record<number, { description: string; icon: IconDefinition }> = {
  0: { description: "Clear sky", icon: faSun },
  1: { description: "Partly cloudy", icon: faCloudSun },
  3: { description: "Cloudy", icon: faCloud },
  5: { description: "Haze", icon: faSmog },
  10: { description: "Mist", icon: faSmog },
  18: { description: "Squalls", icon: faWind },
  19: { description: "Tornado", icon: faTornado },
  20: { description: "Light drizzle", icon: faCloudShowersHeavy },
  21: { description: "Rain", icon: faCloudRain },
  22: { description: "Snow", icon: faSnowflake },
  23: { description: "Rain & snow", icon: faCloudMeatball },
  29: { description: "Thunderstorm", icon: faBolt },
  30: { description: "Duststorm", icon: faSmog },
  36: { description: "Blowing snow", icon: faCloudMeatball },
  40: { description: "Fog", icon: faSmog },
  50: { description: "Light drizzle", icon: faCloudShowersHeavy },
  55: { description: "Heavy drizzle", icon: faCloudShowersHeavy },
  60: { description: "Light rain", icon: faCloudSunRain },
  65: { description: "Heavy rain", icon: faCloudRain },
  70: { description: "Light snow", icon: faCloudMeatball },
  75: { description: "Heavy snow", icon: faSnowflake },
  80: { description: "Rain showers", icon: faCloudSunRain },
  85: { description: "Snow showers", icon: faCloudMeatball },
  95: { description: "Thunderstorm", icon: faBolt },
  99: { description: "Severe thunderstorm", icon: faBolt },
};

export default weatherIconMap;
