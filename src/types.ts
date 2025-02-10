export interface HourWeather {
  date: Date;
  temperature: number;
  precip_prob: number;
  precip_inches: number;
  wind_speed: number;
  wind_direction: number;
  weather_code: number;
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

export interface WeatherListItemProps {
  weather: HourWeather;
}
