export interface HourWeather {
  date: Date;
  temperature: number;
  precip_prob: number;
  precip_inches: number;
  wind_speed: number;
  wind_direction: number;
  weather_code: number;
}

export interface LiveWeather {
  temperature: number;
  temp_high: number;
  temp_low: number;
  temp_feels: number;
  weather_code: number;
  utc_offset_seconds: number;
}

export interface City {
  name: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
}

export interface ResultItemProps {
  city: City;
  addCity: Function;
}

export interface LiveWeatherDisplayProps {
  weather: LiveWeather;
  cityName: string;
}
