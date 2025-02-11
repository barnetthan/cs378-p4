import { 
  WiDaySunny, 
  WiDayCloudy, 
  WiCloud, 
  WiFog, 
  WiStrongWind, 
  WiTornado, 
  WiRain, 
  WiSnow, 
  WiThunderstorm, 
  WiSmoke,
  WiCloudy,
  WiSandstorm,
  WiSprinkle,
  WiHail,
  WiShowers,
  WiRainMix
} from 'react-icons/wi';

// Written with assistance from ChatGPT

// Function to return the icon based on the weather code
const getWeatherIcon = (code: number) => {
  let bestMatch = <WiDaySunny />; 

  for (const key of Object.keys(WeatherIconMap)
    .map(Number)
    .sort((a, b) => a - b)) {
    if (code >= key) {
      bestMatch = WeatherIconMap[key].icon; // Update with the best match icon
    } else {
      break; // Stop once we exceed the number
    }
  }

  return bestMatch;
};

export { getWeatherIcon };

// Mapping of weather codes to icons
const WeatherIconMap: Record<number, { icon: JSX.Element }> = {
  0: { icon: <WiDaySunny /> },
  1: { icon: <WiDayCloudy /> },
  3: { icon: <WiCloud /> },
  4: {icon: <WiSmoke/> },
  5: { icon: <WiFog /> },
  13: {icon: <WiThunderstorm/>},
  18: { icon: <WiStrongWind /> },
  19: { icon: <WiTornado /> },
  20: { icon: <WiCloudy /> },
  30: { icon: <WiSandstorm /> },
  36: { icon: <WiSnow /> },
  40: { icon: <WiFog /> },
  50: { icon: <WiSprinkle /> },
  60: { icon: <WiRain /> },
  70: { icon: <WiSnow /> },
  79: { icon: <WiHail /> },
  80: { icon: <WiShowers /> },
  83: { icon: <WiRainMix />},
  85: { icon: <WiSnow /> },
  87: { icon: <WiHail /> },
  89: { icon: <WiRain /> },
  99: { icon: <WiThunderstorm /> },
};

export default WeatherIconMap;
