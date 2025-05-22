import { findNearestTrails, getTrailImages } from '../trailService';

// These tests make real API calls and should be run separately from unit tests
// You may want to add a longer timeout for these tests
jest.setTimeout(30000);

describe('trailService Integration Tests', () => {
  // Cambridge coordinates
  const userLocation = {
    latitude: 52.1951,
    longitude: 0.1313
  };
  const n = 5;

  describe('findNearestTrails', () => {
    it('should find real trails near Cambridge', async () => {
      const nearestTrails = findNearestTrails(userLocation.latitude, userLocation.longitude, n);
      
      console.log('Found nearest trails:', nearestTrails);
      
      expect(nearestTrails).toHaveLength(n);
      expect(nearestTrails[0]).toHaveProperty('name');
      expect(nearestTrails[0]).toHaveProperty('latitude');
      expect(nearestTrails[0]).toHaveProperty('longitude');
      
      // Log the first trail's details for manual verification
      console.log('First trail details:', nearestTrails[0]);
    });
  });

  describe('getTrailInfo', () => {
    it('should fetch real trail information and photos', async () => {
      // First get the nearest trails
      const nearestTrails = findNearestTrails(userLocation.latitude, userLocation.longitude, n);
      
      // Get info for the first trail
      const trailInfo = await getTrailImages(nearestTrails[0]);
      
      console.log('Trail info:', {
        name: nearestTrails[0].name,
        imageUrls: trailInfo.imageUrls
      });
      
      expect(trailInfo).toHaveProperty('imageUrls');
      // Note: We don't assert the length of imageUrls as some trails might not have photos
      
      // Log the first image URL if available
      if (trailInfo.imageUrls.length > 0) {
        console.log('First image URL:', trailInfo.imageUrls[0]);
      }
    });

    it('should handle a trail that might not have photos', async () => {
      // Get the nearest trails
      const nearestTrails = findNearestTrails(userLocation.latitude, userLocation.longitude, n);
      
      // Try to get info for all trails to see which ones have photos
      for (const trail of nearestTrails) {
        try {
          const trailInfo = await getTrailImages(trail);
          console.log(`Trail "${trail.name}" info:`, {
            hasPhotos: trailInfo.imageUrls.length > 0,
            photoCount: trailInfo.imageUrls.length
          });
        } catch (error: any) {
          console.log(`Error getting info for trail "${trail.name}":`, error.message);
        }
      }
    });
  });
}); 