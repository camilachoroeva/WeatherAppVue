export interface Location {
  place_id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Weather {
  timezone: string;
  temperature: number;
}

export interface Forecast {
  time: string;
  temperature: number;
}

export type WeatherServiceParams = {
  latitude: number;
  longitude: number;
  targetTime: string;
  currentWeather: { value: Weather | null };
  dailyForecast: { value: Forecast[] };
  currentTime: { value: string };
  error: { value: string };
  loading: { value: boolean };
};

export type LocationServiceParams = {
  locationSearch: { value: string };
  locationSuggestions: { value: Location[] };
  error: { value: string };
  loading: { value: boolean };
};