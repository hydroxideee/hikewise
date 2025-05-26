import { KNOWN_TRAILS } from '../../data/knownTrails';
import { calculateDistance, searchPlaceApi } from '../trailService';

describe('Trail Coordinates Verification', () => {
  // Maximum allowed distance in kilometers between stored and actual coordinates
  const MAX_ALLOWED_DISTANCE_KM = 10;

  KNOWN_TRAILS.forEach((trail) => {
    it(`should verify coordinates for ${trail.name}`, async () => {
      // Search for the trail using Google Places API
      const searchResult = await searchPlaceApi(trail.name);
      
      // Get the first result's coordinates
      const firstResult = searchResult.results?.[0];
      expect(firstResult).toBeDefined();
      
      if (firstResult) {
        // Get the location from the result
        const actualLat = firstResult.geometry?.location.lat;
        const actualLng = firstResult.geometry?.location.lng;
        
        expect(actualLat).toBeDefined();
        expect(actualLng).toBeDefined();
        
        if (actualLat && actualLng) {
          // Calculate distance between stored and actual coordinates
          const distance = calculateDistance(
            trail.latitude,
            trail.longitude,
            actualLat,
            actualLng
          );
          
          // Log the comparison for debugging
          console.log(`\nTrail: ${trail.name}`);
          console.log(`Stored coordinates: ${trail.latitude}, ${trail.longitude}`);
          console.log(`Actual coordinates: ${actualLat}, ${actualLng}`);
          console.log(`Distance: ${distance.toFixed(2)} km`);
          
          // Verify the distance is within acceptable range
          expect(distance).toBeLessThanOrEqual(MAX_ALLOWED_DISTANCE_KM);
        }
      }
    }, 30000); // Increased timeout for API calls
  });
});
