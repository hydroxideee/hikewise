import { WeatherPreferences } from "@/context/storageContext";

// Types
interface WeatherCondition {
  iconBaseUri: string;
  description: {
    text: string;
    languageCode: string;
  };
  type: string;
}

interface Temperature {
  degrees: number;
  unit: string;
}

interface Precipitation {
  probability: {
    percent: number;
    type: string;
  };
  snowQpf: {
    quantity: number;
    unit: string;
  };
  qpf: {
    quantity: number;
    unit: string;
  };
}

interface Wind {
  direction: {
    degrees: number;
    cardinal: string;
  };
  speed: {
    value: number;
    unit: string;
  };
  gust: {
    value: number;
    unit: string;
  };
}

interface CurrentConditionsHistory {
  temperatureChange: Temperature;
  maxTemperature: Temperature;
  minTemperature: Temperature;
  snowQpf: {
    quantity: number;
    unit: string;
  };
  qpf: {
    quantity: number;
    unit: string;
  };
}

export interface WeatherResponse {
  interval?: {
    startTime: string;
    endTime: string;
  };
  displayDateTime?: {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    nanos: number;
    utcOffset: string;
  };
  currentTime?: string;
  timeZone?: {
    id: string;
  };
  isDaytime?: boolean;
  weatherCondition: WeatherCondition;
  temperature: Temperature;
  feelsLikeTemperature: Temperature;
  dewPoint: Temperature;
  heatIndex: Temperature;
  windChill: Temperature;
  relativeHumidity: number;
  uvIndex: number;
  precipitation: Precipitation;
  thunderstormProbability: number;
  airPressure: {
    meanSeaLevelMillibars: number;
  };
  wind: Wind;
  visibility: {
    distance: number;
    unit: string;
  };
  cloudCover: number;
  currentConditionsHistory: CurrentConditionsHistory;
}

export class WeatherService {
  private readonly apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string;
  private readonly baseUrl = 'https://weather.googleapis.com/v1';

  // Fetch weather data from the API
  private async fetchWeatherData<T>(endpoint: string, params: URLSearchParams): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${endpoint}?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Get current weather conditions for a specific location
   */
  async getCurrentConditions(latitude: number, longitude: number): Promise<WeatherResponse> {
    try {
      const p = {
        key: this.apiKey,
        'location.latitude': latitude.toString(),
        'location.longitude': longitude.toString(),
      }

      const params = new URLSearchParams(p);
      return await this.fetchWeatherData<WeatherResponse>('currentConditions:lookup', params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch current weather conditions: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching weather conditions');
    }
  }

  /**
   * Get hourly weather forecast for a specific location
   * @param hours - Number of hours to forecast (max 240)
   */
  async getHourlyForecast(
    latitude: number,
    longitude: number,
    hours: number = 24
  ): Promise<WeatherResponse[]> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        'location.latitude': latitude.toString(),
        'location.longitude': longitude.toString(),
        hours: Math.min(hours, 240).toString(), // API limit is 240 hours
      });

      return await this.fetchWeatherData<WeatherResponse[]>('forecast/hours:lookup', params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching hourly forecast');
    }
  }

  /**
   * Get daily weather forecast for a specific location
   * @param days - Number of days to forecast (max 10)
   */
  async getDailyForecast(
    latitude: number,
    longitude: number,
    days: number = 10
  ): Promise<WeatherResponse[]> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        'location.latitude': latitude.toString(),
        'location.longitude': longitude.toString(),
        days: Math.min(days, 10).toString(), // API limit is 10 days
        pageSize: '10'
      });

      return await this.fetchWeatherData<WeatherResponse[]>('forecast/days:lookup', params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch daily forecast: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching daily forecast');
    }
  }
}


export function getScore(weather: WeatherResponse, preferences: WeatherPreferences): number {
  const score = 30-(
    Math.log((weather.temperature.degrees - preferences.temperature + 1)**2) +
     Math.log((weather.wind.speed.value - preferences.windSpeed/3 + 1)**2) +
      Math.log((weather.precipitation.probability.percent - preferences.precipitation + 1)**2) +
       Math.log((weather.cloudCover - preferences.cloudCover + 1)**2) +
        Math.log((weather.uvIndex - preferences.uvIndex/10 + 1)**2)
      ) 
  return Math.min(10, Math.max(score, 0)) ?? 0
}