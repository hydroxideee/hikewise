# Services Documentation

This document provides detailed usage examples for the Weather and Trail services in the HikeWise application.

## Weather Service

The Weather Service provides access to current conditions and forecasts using the Google Weather API.

### Initialization

```typescript
import { WeatherService } from './services/weatherService';

const weatherService = new WeatherService();
```

### Current Conditions

Get current weather conditions for a specific location:

```typescript
// Example coordinates for Cambridge, UK
const latitude = 52.1951;
const longitude = 0.1313;

const currentWeather = await weatherService.getCurrentConditions(latitude, longitude);

// Access various weather attributes
console.log(`Current temperature: ${currentWeather.temperature.degrees}${currentWeather.temperature.unit}`);
console.log(`Feels like: ${currentWeather.feelsLikeTemperature.degrees}${currentWeather.feelsLikeTemperature.unit}`);
console.log(`Wind speed: ${currentWeather.wind.speed.value} ${currentWeather.wind.speed.unit}`);
console.log(`Wind direction: ${currentWeather.wind.direction.cardinal} (${currentWeather.wind.direction.degrees}°)`);
console.log(`Humidity: ${currentWeather.relativeHumidity}%`);
console.log(`UV Index: ${currentWeather.uvIndex}`);
console.log(`Precipitation probability: ${currentWeather.precipitation.probability.percent}%`);
console.log(`Weather condition: ${currentWeather.weatherCondition.description.text}`);
```

### Hourly Forecast

Get hourly weather forecast for up to 240 hours (10 days):

```typescript
// Get 24-hour forecast (default)
const hourlyForecast = await weatherService.getHourlyForecast(latitude, longitude);

// Get 48-hour forecast
const twoDayForecast = await weatherService.getHourlyForecast(latitude, longitude, 48);

// Access forecast data
hourlyForecast.forEach(forecast => {
    const time = forecast.displayDateTime;
    console.log(`Time: ${time.hours}:${time.minutes}`);
    console.log(`Temperature: ${forecast.temperature.degrees}${forecast.temperature.unit}`);
    console.log(`Wind: ${forecast.wind.speed.value} ${forecast.wind.speed.unit} ${forecast.wind.direction.cardinal}`);
    console.log(`Precipitation: ${forecast.precipitation.probability.percent}%`);
    console.log('---');
});
```

### Daily Forecast

Get daily weather forecast for up to 10 days:

```typescript
// Get 7-day forecast (default)
const dailyForecast = await weatherService.getDailyForecast(latitude, longitude);

// Get 10-day forecast
const tenDayForecast = await weatherService.getDailyForecast(latitude, longitude, 10);

// Access forecast data
dailyForecast.forEach(forecast => {
    const date = forecast.displayDateTime;
    console.log(`Date: ${date.year}-${date.month}-${date.day}`);
    console.log(`Max temperature: ${forecast.currentConditionsHistory.maxTemperature.degrees}${forecast.currentConditionsHistory.maxTemperature.unit}`);
    console.log(`Min temperature: ${forecast.currentConditionsHistory.minTemperature.degrees}${forecast.currentConditionsHistory.minTemperature.unit}`);
    console.log(`Precipitation: ${forecast.precipitation.probability.percent}%`);
    console.log('---');
});
```

## Trail Service

The Trail Service provides functionality to find nearby trails and get trail information.

### Finding Nearby Trails

```typescript
import { findNearestTrails } from './services/trailService';

// Example coordinates for Cambridge, UK
const userLatitude = 52.1951;
const userLongitude = 0.1313;

// Find 5 nearest trails (default)
const nearestTrails = findNearestTrails(userLatitude, userLongitude);

// Find 3 nearest trails
const threeNearestTrails = findNearestTrails(userLatitude, userLongitude, 3);

// Access trail information
nearestTrails.forEach(trail => {
    console.log(`Trail name: ${trail.name}`);
    console.log(`Coordinates: ${trail.latitude}, ${trail.longitude}`);
    console.log('---');
});
```

### Getting Trail Information

```typescript
import { getTrailImages } from './services/trailService';

// Get information for a specific trail
const trailInfo = await getTrailImages({
    name: "Example Trail",
    latitude: 52.1951,
    longitude: 0.1313
});

// Access trail information
console.log(`Trail name: ${trailInfo.name}`);
console.log(`Coordinates: ${trailInfo.latitude}, ${trailInfo.longitude}`);
console.log(`Number of images: ${trailInfo.imageUrls.length}`);
console.log('Image URLs:', trailInfo.imageUrls);
```

## Error Handling

Both services include error handling for API failures. Here's how to handle errors:

```typescript
try {
    const weather = await weatherService.getCurrentConditions(latitude, longitude);
    // Process weather data
} catch (error) {
    console.error('Failed to fetch weather:', error.message);
}

try {
    const trailInfo = await getTrailImages(trail);
    // Process trail data
} catch (error) {
    console.error('Failed to fetch trail information:', error.message);
}
```

## Notes

- The Weather Service requires a valid Google API key
- Weather forecasts are limited to 240 hours for hourly forecasts and 10 days for daily forecasts
- Trail information includes photos when available from the Google Places API
- All coordinates should be provided in decimal degrees format 