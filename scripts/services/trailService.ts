import { GOOGLE_API_KEY } from '@env';
import { KNOWN_TRAILS, TrailCoordinates } from '../data/knownTrails';

export interface TrailInfo {
  name: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  imageUrls: string[];
}

interface PlacePhoto {
  name: string;
  photo_reference?: string;
  height?: number;
  width?: number;
  html_attributions?: string[];
}

interface PlacesApiResponse {
  result?: {
    id: string;
    photos?: PlacePhoto[];
  };
  results?: Array<{
    place_id: string;
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
      html_attributions: string[];
    }>;
  }>;
  status?: string;
  error_message?: string;
}

// Helper function to calculate distance between two coordinates
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

// Find n closest trails to given coordinates
export const findNearestTrails = (
  userLatitude: number,
  userLongitude: number,
  n: number = 5
): TrailCoordinates[] => {
  // Calculate distances to all known trails
  const trailsWithDistances = KNOWN_TRAILS.map(trail => ({
    ...trail,
    distance: calculateDistance(
      userLatitude,
      userLongitude,
      trail.latitude,
      trail.longitude
    )
  }));

  // Sort by distance and return n closest
  return trailsWithDistances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n)
    .map(({ name, latitude, longitude }) => ({ name, latitude, longitude }));
};

// Get trail information directly from Places API
export const getTrailInfo = async (coordinates: TrailCoordinates): Promise<TrailInfo> => {
  // Get place ID either from coordinates object or by searching
  let placeId = coordinates.place_id;
  let photoRefs = [];

  if (placeId) {
    // Call Places API for details including photos
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,photos&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result) {
      throw new Error(`Could not get place details for trail: ${coordinates.name}`);
    }
    photoRefs = data.result.photos?.map((photo: PlacePhoto) => photo.name) || [];
  }
  else {
    // use text search with fields place_id and photos
    console.log('making search request')
    const searchQuery = `${coordinates.name} trail UK`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${GOOGLE_API_KEY}&fields=place_id,photos`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API Response data:', data);
    // TODO: cache place_id for a location for more reliable results. photos cannot be cached.
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      placeId = result.place_id;
      photoRefs = result.photos?.map((photo: any) => photo.photo_reference) || [];
    } else {
      throw new Error(`Could not find place ID for trail: ${coordinates.name}`);
    }
    console.log('placeId', placeId, '\nphotoRefs', photoRefs);
  }

  return {
    ...coordinates,
    imageUrls: photoRefs.map((ref: string) => 
      `https://places.googleapis.com/v1/places/${placeId}/photos/${ref}/media?maxHeightPx=600&maxWidthPx=600&key=${GOOGLE_API_KEY}`
    )
  };
};
