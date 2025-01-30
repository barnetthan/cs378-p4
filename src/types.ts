export interface HourWeather {
  date: Date;
  temperature: number;
}

export interface City {
  name: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
}
