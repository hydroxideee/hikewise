import { WeatherService } from '../weatherService';

describe('WeatherService Integration Tests', () => {
  let weatherService: WeatherService;

  beforeAll(() => {
    weatherService = new WeatherService();
  });

//   describe('getCurrentConditions', () => {
//     it('should fetch current weather conditions for New York City coordinates', async () => {
//       // NYC coordinates
//       const latitude = 40.7128;
//       const longitude = -74.0060;

//       const weather = await weatherService.getCurrentConditions(latitude, longitude);
//       console.log(weather);

//       // Verify the response structure
//       expect(weather).toBeDefined();
//       expect(typeof weather.temperature).toBe('number');
//       expect(typeof weather.humidity).toBe('number');
//       expect(typeof weather.windSpeed).toBe('number');
//       expect(typeof weather.windDirection).toBe('number');
//       expect(typeof weather.precipitation).toBe('number');
//       expect(typeof weather.cloudCover).toBe('number');
//       expect(typeof weather.timestamp).toBe('string');

//       // Log the weather data for inspection
//       console.log('Current Weather in NYC:', {
//         temperature: weather.temperature,
//         humidity: weather.humidity,
//         windSpeed: weather.windSpeed,
//         windDirection: weather.windDirection,
//         precipitation: weather.precipitation,
//         cloudCover: weather.cloudCover,
//         timestamp: weather.timestamp
//       });
//     }, 10000); // Increased timeout for API call

//     it('should handle invalid coordinates gracefully', async () => {
//       const invalidLatitude = 1000; // Invalid latitude
//       const invalidLongitude = 2000; // Invalid longitude

//       await expect(
//         weatherService.getCurrentConditions(invalidLatitude, invalidLongitude)
//       ).rejects.toThrow();
//     }, 10000);
//   });

//   describe('getHourlyForecast', () => {
//     // it('should fetch hourly forecast for New York City coordinates', async () => {
//     //   // NYC coordinates
//     //   const latitude = 40.7128;
//     //   const longitude = -74.0060;
//     //   const hours = 24;

//     //   const forecast = await weatherService.getHourlyForecast(latitude, longitude, hours);

//     //   // Verify the response structure
//     //   expect(Array.isArray(forecast)).toBe(true);
//     //   expect(forecast.length).toBeLessThanOrEqual(hours);

//     //   // Verify each forecast entry
//     //   forecast.forEach(weather => {
//     //     expect(weather).toBeDefined();
//     //     expect(weather.temperature).toBeDefined();
//     //     expect(typeof weather.temperature.degrees).toBe('number');
//     //     expect(typeof weather.relativeHumidity).toBe('number');
//     //     expect(weather.wind).toBeDefined();
//     //     expect(typeof weather.wind.speed.value).toBe('number');
//     //     expect(typeof weather.wind.direction.degrees).toBe('number');
//     //     expect(weather.precipitation).toBeDefined();
//     //     expect(typeof weather.precipitation.probability.percent).toBe('number');
//     //     expect(typeof weather.cloudCover).toBe('number');
//     //     expect(weather.displayDateTime).toBeDefined();
//     //   });

//     //   // Log the first forecast entry for inspection
//     //   console.log('First Hourly Forecast in NYC:', forecast[0]);
//     // }, 10000);

//     it('should handle invalid coordinates gracefully', async () => {
//       const invalidLatitude = 1000;
//       const invalidLongitude = 2000;

//       await expect(
//         weatherService.getHourlyForecast(invalidLatitude, invalidLongitude)
//       ).rejects.toThrow();
//     }, 10000);

//     it('should respect the maximum hours limit', async () => {
//       const latitude = 40.7128;
//       const longitude = -74.0060;
//       const hours = 300; // Request more than the 240 hour limit

//       const forecast = await weatherService.getHourlyForecast(latitude, longitude, hours);
//       expect(forecast.length).toBeLessThanOrEqual(240);
//     }, 10000);

//     it('should fetch hourly forecast for West Highland Way trail coordinates', async () => {
//       // West Highland Way coordinates
//       const latitude = 56.3857409;
//       const longitude = -4.6383494;
//       const hours = 24;

//       const forecast = await weatherService.getHourlyForecast(latitude, longitude, hours);

//       console.log(forecast);
//       // Verify the response structure
//     //   expect(Array.isArray(forecast)).toBe(true);
//     //   expect(forecast.length).toBe(hours);

//       // Verify each forecast entry
//       forecast.forEach(weather => {
//         expect(weather).toBeDefined();
//         expect(weather.temperature).toBeDefined();
//         expect(typeof weather.temperature.degrees).toBe('number');
//         expect(typeof weather.relativeHumidity).toBe('number');
//         expect(weather.wind).toBeDefined();
//         expect(typeof weather.wind.speed.value).toBe('number');
//         expect(typeof weather.wind.direction.degrees).toBe('number');
//         expect(weather.precipitation).toBeDefined();
//         expect(typeof weather.precipitation.probability.percent).toBe('number');
//         expect(typeof weather.cloudCover).toBe('number');
//         expect(weather.displayDateTime).toBeDefined();
//       });

//       // Log the first forecast entry for inspection
//       console.log('First Hourly Forecast for West Highland Way:', forecast[0]);
//     }, 10000);
//   });

  describe('getDailyForecast', () => {
    // it('should fetch daily forecast for New York City coordinates', async () => {
    //   // NYC coordinates
    //   const latitude = 40.7128;
    //   const longitude = -74.0060;
    //   const days = 7;

    //   const forecast = await weatherService.getDailyForecast(latitude, longitude, days);

    //   // Verify the response structure
    //   expect(Array.isArray(forecast)).toBe(true);
    //   expect(forecast.length).toBeLessThanOrEqual(days);

    //   // Verify each forecast entry
    //   forecast.forEach(weather => {
    //     expect(weather).toBeDefined();
    //     expect(weather.temperature).toBeDefined();
    //     expect(typeof weather.temperature.degrees).toBe('number');
    //     expect(typeof weather.relativeHumidity).toBe('number');
    //     expect(weather.wind).toBeDefined();
    //     expect(typeof weather.wind.speed.value).toBe('number');
    //     expect(typeof weather.wind.direction.degrees).toBe('number');
    //     expect(weather.precipitation).toBeDefined();
    //     expect(typeof weather.precipitation.probability.percent).toBe('number');
    //     expect(typeof weather.cloudCover).toBe('number');
    //     expect(weather.displayDateTime).toBeDefined();
    //   });

    //   // Log the first forecast entry for inspection
    //   console.log('First Daily Forecast in NYC:', forecast[0]);
    // }, 10000);

    // it('should handle invalid coordinates gracefully', async () => {
    //   const invalidLatitude = 1000;
    //   const invalidLongitude = 2000;

    //   await expect(
    //     weatherService.getDailyForecast(invalidLatitude, invalidLongitude)
    //   ).rejects.toThrow();
    // }, 10000);

    it('should respect the maximum days limit', async () => {
      const latitude = 40.7128;
      const longitude = -74.0060;
      const days = 15; // Request more than the 10 day limit

      const forecast = await weatherService.getDailyForecast(latitude, longitude, days);
      expect(forecast.length).toBeLessThanOrEqual(10);
    }, 10000);

    it('should fetch daily forecast for West Highland Way trail coordinates', async () => {
      // West Highland Way coordinates
      const latitude = 56.3857409;
      const longitude = -4.6383494;
      const days = 10;

      const forecast = await weatherService.getDailyForecast(latitude, longitude, days);

      // Verify the response structure
      console.log(forecast);
    //   expect(Array.isArray(forecast)).toBe(true);
    //   expect(forecast.length).toBe(days);

      // Verify each forecast entry
      forecast.forEach(weather => {
        expect(weather).toBeDefined();
        expect(weather.temperature).toBeDefined();
        expect(typeof weather.temperature.degrees).toBe('number');
        expect(typeof weather.relativeHumidity).toBe('number');
        expect(weather.wind).toBeDefined();
        expect(typeof weather.wind.speed.value).toBe('number');
        expect(typeof weather.wind.direction.degrees).toBe('number');
        expect(weather.precipitation).toBeDefined();
        expect(typeof weather.precipitation.probability.percent).toBe('number');
        expect(typeof weather.cloudCover).toBe('number');
        expect(weather.displayDateTime).toBeDefined();
      });

      // Log the first forecast entry for inspection
      console.log('First Daily Forecast for West Highland Way:', forecast[0]);
    }, 10000);
  });
});
