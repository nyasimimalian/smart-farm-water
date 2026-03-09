import { useQuery } from "@tanstack/react-query";

export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  rainExpected: boolean;
  city: string;
}

// OpenWeatherMap free API - using a demo/free key pattern
// Users should replace with their own key
const API_KEY = ""; // Will use mock data if empty

function getMockWeather(location: string): WeatherData {
  return {
    temp: 26 + Math.round(Math.random() * 6),
    humidity: 55 + Math.round(Math.random() * 20),
    description: ["Partly cloudy", "Sunny", "Light rain expected", "Clear skies"][
      Math.floor(Math.random() * 4)
    ],
    icon: "⛅",
    windSpeed: 5 + Math.round(Math.random() * 15),
    rainExpected: Math.random() > 0.6,
    city: location,
  };
}

export function useWeather(location: string) {
  return useQuery({
    queryKey: ["weather", location],
    queryFn: async (): Promise<WeatherData> => {
      if (!API_KEY) {
        // Return mock weather data
        return getMockWeather(location);
      }
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) return getMockWeather(location);
      const data = await res.json();
      return {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: Math.round(data.wind.speed * 3.6),
        rainExpected: data.weather.some((w: { main: string }) => w.main === "Rain"),
        city: data.name,
      };
    },
    refetchInterval: 600000, // 10 min
    staleTime: 300000,
  });
}
