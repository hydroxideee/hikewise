import { GOOGLE_PLACES_API_KEY } from './__mocks__/@env';
import { findNearestTrails, getTrailImages } from './trailService';
import { WeatherService } from './weatherService';

// Example coordinates for Cambridge, UK
const CAMBRIDGE_COORDS = {
  latitude: 52.1951,
  longitude: 0.1313
};

// Integration showcase
async function demonstrateServices() {
  try {
    console.log('GOOGLE_PLACES_API_KEY:', GOOGLE_PLACES_API_KEY);
    // Initialize weather service
    const weatherService = new WeatherService();

    // 1. Find nearest trails
    console.log('Finding nearest trails...');
    const nearbyTrails = findNearestTrails(
      CAMBRIDGE_COORDS.latitude, 
      CAMBRIDGE_COORDS.longitude,
      3 // Get top 3 trails
    );
    console.log('Nearest trails:', nearbyTrails);

    // 2. Get weather for current location
    console.log('\nFetching current weather...');
    const currentWeather = await weatherService.getCurrentConditions(
      CAMBRIDGE_COORDS.latitude,
      CAMBRIDGE_COORDS.longitude
    );
    console.log('Current conditions:', {
      temperature: `${currentWeather.temperature.degrees}${currentWeather.temperature.unit}`,
      conditions: currentWeather.weatherCondition.description.text,
      wind: `${currentWeather.wind.speed.value} ${currentWeather.wind.speed.unit} ${currentWeather.wind.direction.cardinal}`
    });

    // 3. Get trail images and weather forecast for first trail
    if (nearbyTrails.length > 0) {
      const firstTrail = nearbyTrails[0];
      console.log(`\nGetting details for trail: ${firstTrail.name}`);

      // Get trail images
      const trailInfo = await getTrailImages(firstTrail);
      console.log('Trail images:', trailInfo.imageUrls);

      // Get weather forecast for trail location
      const forecast = await weatherService.getDailyForecast(
        firstTrail.latitude,
        firstTrail.longitude,
        3 // 3-day forecast
      );
      
      console.log('\nTrail location forecast:');
      forecast.forEach(day => {
        const date = day.displayDateTime;
        if (date) {
          console.log(`${date.year}-${date.month}-${date.day}:`, {
            maxTemp: `${day.currentConditionsHistory.maxTemperature.degrees}${day.currentConditionsHistory.maxTemperature.unit}`,
            minTemp: `${day.currentConditionsHistory.minTemperature.degrees}${day.currentConditionsHistory.minTemperature.unit}`,
            conditions: day.weatherCondition.description.text,
            precipitation: `${day.precipitation.probability.percent}%`
          });
        }
      });
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Service integration failed:', error.message);
    } else {
      console.error('An unexpected error occurred');
    }
  }
}

// Run the demonstration
demonstrateServices();
