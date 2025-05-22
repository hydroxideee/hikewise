import { findNearestTrails, getTrailInfo } from '../trailService';

// Mock fetch globally
global.fetch = jest.fn();

describe('trailService', () => {
  const userLocation = {
    latitude: 52.1951,
    longitude: 0.1313
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('findNearestTrails', () => {
    it('should return the 5 closest trails by default', () => {
      const nearestTrails = findNearestTrails(userLocation.latitude, userLocation.longitude);
      
      expect(nearestTrails).toHaveLength(5);
      expect(nearestTrails[0]).toHaveProperty('name');
      expect(nearestTrails[0]).toHaveProperty('latitude');
      expect(nearestTrails[0]).toHaveProperty('longitude');
    });

    it('should return specified number of trails', () => {
      const numTrails = 3;
      const nearestTrails = findNearestTrails(userLocation.latitude, userLocation.longitude, numTrails);
      
      expect(nearestTrails).toHaveLength(numTrails);
    });

    it('should sort trails by distance', () => {
      const nearestTrails = findNearestTrails(userLocation.latitude, userLocation.longitude);
      
      // Verify the trails are sorted by distance
      for (let i = 1; i < nearestTrails.length; i++) {
        const prevDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          nearestTrails[i - 1].latitude,
          nearestTrails[i - 1].longitude
        );
        const currentDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          nearestTrails[i].latitude,
          nearestTrails[i].longitude
        );
        expect(prevDistance).toBeLessThanOrEqual(currentDistance);
      }
    });
  });

  describe('getTrailInfo', () => {
    const mockPlaceId = 'mock-place-id';
    const mockPhotoRef = 'mock-photo-ref';
    const mockTrail = {
      name: 'Test Trail',
      latitude: 52.1951,
      longitude: 0.1313,
      place_id: mockPlaceId
    };

    it('should fetch trail information successfully', async () => {
      // Mock the Places API response
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: {
              photos: [{ name: mockPhotoRef }]
            }
          })
        })
      );

      const trailInfo = await getTrailInfo(mockTrail);

      expect(trailInfo).toHaveProperty('imageUrls');
      expect(trailInfo.imageUrls).toHaveLength(1);
      expect(trailInfo.imageUrls[0]).toContain(mockPlaceId);
      expect(trailInfo.imageUrls[0]).toContain(mockPhotoRef);
    });

    it('should handle missing photos gracefully', async () => {
      // Mock the Places API response with no photos
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: {
              photos: []
            }
          })
        })
      );

      const trailInfo = await getTrailInfo(mockTrail);

      expect(trailInfo).toHaveProperty('imageUrls');
      expect(trailInfo.imageUrls).toHaveLength(0);
    });

    it('should throw error when place details cannot be found', async () => {
      // Mock the Places API response with no result
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({})
        })
      );

      await expect(getTrailInfo(mockTrail)).rejects.toThrow(
        `Could not get place details for trail: ${mockTrail.name}`
      );
    });
  });
});

// Helper function for distance calculation (copied from trailService)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
}; 