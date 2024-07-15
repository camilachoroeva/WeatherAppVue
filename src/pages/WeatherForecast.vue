<script setup lang="ts">
  import { ref } from 'vue';
  import { fetchForWeather, searchForLocations } from '../services/service';
  import type { Weather,Forecast, Location } from '../types/types';
  
  const locationSearch = ref<string>('');
  const locationSuggestions = ref<Location[]>([])
  const currentWeather = ref<Weather | null>(null)
  const dailyForecast = ref<Forecast[]>([]);
  const loading = ref<boolean>(false)
  const error = ref<string>('');
  const currentTime = ref<string>('')
  
  const selectLocation = (location: Location) => {
    locationSearch.value = location.name;
    fetchForWeather({
      latitude: location.latitude,
      longitude: location.longitude,
      targetTime: 'current',
      currentWeather,
      dailyForecast,
      currentTime,
      error,
      loading,
    });
    locationSuggestions.value = []
  }
  
  const handleSearchLocations = async () => {
    await searchForLocations({
      locationSearch,
      locationSuggestions,
      error,
      loading,
    });
  }
  
  const formatDate = (datetime: string): string => {
    const dateObj = new Date(datetime);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
    return dateObj.toLocaleDateString('en-US', options)
  };
  
  const formatTime = (datetime: string): string => {
    return datetime.split('T')[1]
  };
  
</script>

<template>
    <div class="bg-slate-900 text-white flex justify-center">
      <div class="flex flex-col max-w-3xl justify-center min-h-screen">
        <form @submit.prevent class="flex justify-center">
          <div class="relative">
            <div class="flex items-center mb-4">
              <img src="@/assets/search.svg" alt="Search Icon" class="absolute left-3 h-5 w-5">
              <input type="text" v-model="locationSearch" placeholder="Enter a location" @input="handleSearchLocations"
                class="pl-10 rounded-full py-2 text-black w-80 focus:outline-none" />
            </div>
            <ul v-if="locationSuggestions.length" class="absolute left-0 right-0 top-12 rounded-xl bg-white text-black z-10">
              <li v-for="location in locationSuggestions" :key="location.place_id" @click="selectLocation(location)"
                class="p-2 cursor-pointer hover:bg-gray-200 rounded-xl">
                <div>{{ location.name }}, {{ location.country }}</div>
              </li>
            </ul>
          </div>
        </form>
        <div v-if="currentWeather" class="mt-4">
          <div class="text-2xl mb-2">Main Info</div>
          <div class="bg-gray-600 p-4 text-lg rounded-lg">
            <div>Location: {{ locationSearch }}</div>
            <div>User's time: {{ currentTime }}</div>
            <div>Temperature in the location for user's time: {{ currentWeather.temperature }}°C</div>
          </div>
        </div>
        <div v-if="dailyForecast.length" class="mt-4">
          <div class="text-2xl mb-2">Hourly Weather for {{ formatDate(dailyForecast[0].time) }}</div>
          <div class="grid grid-cols-6 gap-y-2 gap-x-4">
            <div v-for="forecast in dailyForecast" :key="forecast.time" class="mt-2 bg-gray-600 p-4 rounded-lg">
              <div>{{ formatTime(forecast.time) }}</div>
              <div class="text-2xl">{{ forecast.temperature }}°C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
