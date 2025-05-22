import { GOOGLE_API_KEY } from '@env';
import { KNOWN_TRAILS, TrailCoordinates } from '../data/knownTrails';

export interface TrailInfo extends TrailCoordinates {
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

// Constants
const EARTH_RADIUS_KM = 6371;

// Utility functions
const toRad = (value: number): number => (value * Math.PI) / 180;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

// API functions
const fetchPlaceDetails = async (placeId: string): Promise<PlacePhoto[]> => {
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,photos&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data: PlacesApiResponse = await response.json();

  if (!data.result) {
    throw new Error(`Could not get place details for place ID: ${placeId}`);
  }
  return data.result.photos || [];
};

const searchPlace = async (name: string): Promise<{ placeId: string; photoRefs: string[] }> => {
  const searchQuery = `${name} trail UK`;
  const encodedQuery = encodeURIComponent(searchQuery);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${GOOGLE_API_KEY}&fields=place_id,photos`;
  console.log('Search URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  const data: PlacesApiResponse = await response.json();
  
  if (!data.results?.length) {
    throw new Error(`Could not find place ID for trail: ${name}`);
  }

  const result = data.results[0];
  return {
    placeId: result.place_id,
    photoRefs: result.photos?.map(photo => photo.photo_reference) || []
  };
};

// Public functions
export const findNearestTrails = (
  userLatitude: number,
  userLongitude: number,
  n: number = 5
): TrailCoordinates[] => {
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

export const getTrailImages = async (coordinates: TrailCoordinates): Promise<TrailInfo> => {
  let placeId = coordinates.place_id;
  let photoRefs: string[] = [];

  if (placeId) {
    const photos = await fetchPlaceDetails(placeId);
    photoRefs = photos.map(photo => photo.photo_reference || '');
  } else {
    // console.log('Searching for place ID...');
    const searchResult = await searchPlace(coordinates.name);
    // console.log('Search result:', searchResult);
    placeId = searchResult.placeId;
    photoRefs = searchResult.photoRefs;
  }

  return {
    ...coordinates,
    imageUrls: photoRefs
      .filter(ref => ref) // Filter out any empty references
      .map(ref => 
        `https://maps.googleapis.com/maps/api/place/photo?maxheight=600&maxwidth=600&photo_reference=${ref}&key=${GOOGLE_API_KEY}`
      )
  };
};
