import type { WeatherServiceParams, LocationServiceParams } from '../types/types'

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search?language=en&format=json'

export const fetchForWeather = async ({
  latitude,
  longitude,
  targetTime,
  currentWeather,
  dailyForecast,
  currentTime,
  error,
  loading,
}: WeatherServiceParams) => {
  loading.value = true
  try {
    const userDate = new Date().toISOString().split('T')[0];
    const response = await fetch(`${API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&start_date=${userDate}&end_date=${userDate}`);
    const data = await response.json();

    if (data && data.hourly && data.hourly.temperature_2m) {
      const currentHour = new Date().getHours();
      const index = targetTime === 'current' ? data.hourly.time.findIndex((time: string) => new Date(time).getHours() === currentHour) : data.hourly.time.indexOf(targetTime);

      if (index !== -1) {
        currentWeather.value = {
          timezone: data.timezone,
          temperature: data.hourly.temperature_2m[index],
        };
        currentTime.value = new Date().toLocaleTimeString()
        error.value = ''
      } else {
        console.error('Hourly temperature not found:', targetTime)
      }

      dailyForecast.value = data.hourly.time.map((time: string, index: string) => ({
        time,
        temperature: data.hourly.temperature_2m[index],
      }));
    } else {
      console.error('Hourly temperature not found:', data)
    }
  } catch (err) {
    console.error('Error fetching weather:', err)
  } finally {
    loading.value = false;
  }
};

export const searchForLocations = async ({
  locationSearch,
  locationSuggestions,
  error,
  loading,
}: LocationServiceParams) => {
  if (!locationSearch.value.trim()) {
    locationSuggestions.value = []
    return
  }
  loading.value = true;
  try {
    const encodedLocation = encodeURIComponent(locationSearch.value);
    const response = await fetch(`${GEOCODING_API_URL}&name=${encodedLocation}&count=10`);
    const data = await response.json();
    locationSuggestions.value = data.results.map((location: any) => ({
      place_id: location.id,
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  } catch (err) {
    console.error('Error with locations fetching:', err)
  } finally {
    loading.value = false;
  }
};