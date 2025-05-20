import { GOOGLE_API_KEY } from '@env';

interface WeatherResponse {
  temperature: {
    value: number;
    unit: string;
  };
  humidity: {
    value: number;
    unit: string;
  };
  windSpeed: {
    value: number;
    unit: string;
  };
  windDirection: {
    value: number;
    unit: string;
  };
  precipitation: {
    value: number;
    unit: string;
  };
  cloudCover: {
    value: number;
    unit: string;
  };
  timestamp: string;
  condition: string;
}

interface ForecastResponse {
  hourly: WeatherResponse[];
  daily: WeatherResponse[];
}

export class WeatherService {
    /**
     * Get current weather conditions for a specific location
     * @param latitude - The latitude coordinate
     * @param longitude - The longitude coordinate
    */
    private readonly apiKey = GOOGLE_API_KEY;
    private readonly baseUrl = 'https://weather.googleapis.com/v1';

    async getCurrentConditions(latitude: number, longitude: number): Promise<WeatherResponse> {
        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                'location.latitude': latitude.toString(),
                'location.longitude': longitude.toString(),
            });
            
            console.log(`${this.baseUrl}/currentConditions:lookup?${params}`); 
            const response = await fetch(`${this.baseUrl}/currentConditions:lookup?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: WeatherResponse = await response.json();
            // console.log(data);
            return data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch current weather conditions: ${error.message}`);
            }
            throw new Error('An unexpected error occurred while fetching weather conditions');
        }
    }

    /**
     * Get hourly weather forecast for a specific location
     * @param latitude - The latitude coordinate
     * @param longitude - The longitude coordinate
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

            console.log(`${this.baseUrl}/forecast/hours:lookup?${params}`);
            const response = await fetch(`${this.baseUrl}/forecast/hours:lookup?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: WeatherResponse[] = await response.json();
            return data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
            }
            throw new Error('An unexpected error occurred while fetching hourly forecast');
        }
    }

    /**
     * Get daily weather forecast for a specific location
     * @param latitude - The latitude coordinate
     * @param longitude - The longitude coordinate
     * @param days - Number of days to forecast (max 10)
     */
    async getDailyForecast(
        latitude: number,
        longitude: number,
        days: number = 7
    ): Promise<WeatherResponse[]> {
        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                'location.latitude': latitude.toString(),
                'location.longitude': longitude.toString(),
                days: Math.min(days, 10).toString(), // API limit is 10 days
            });

            console.log(`${this.baseUrl}/forecast/days:lookup?${params}`);
            const response = await fetch(`${this.baseUrl}/forecast/days:lookup?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: WeatherResponse[] = await response.json();
            return data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch daily forecast: ${error.message}`);
            }
            throw new Error('An unexpected error occurred while fetching daily forecast');
        }
    }
}
