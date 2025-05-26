import { KNOWN_TRAILS, TrailCoordinates } from '../data/knownTrails';

export interface TrailInfo extends TrailCoordinates {
  imageUrls: string[];
}

export interface PlacePhoto {
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
    geometry?: {
      location: {
        lat: number;
        lng: number;
      };
    };
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

export const calculateDistance = (
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
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,photos&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data: PlacesApiResponse['result'] = await response.json();

  if (!data) {
    throw new Error(`Could not get place details for place ID: ${placeId}`);
  }
  return data.photos || [];
};

export const searchPlaceApi = async (name: string): Promise<PlacesApiResponse> => {
  const searchQuery = `${name} trail UK`;
  const encodedQuery = encodeURIComponent(searchQuery);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}&fields=place_id,photos,location`;
//   console.log('Search URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  const data: PlacesApiResponse = await response.json();
  
  if (!data.results?.length) {
    throw new Error(`Could not find place ID for trail: ${name}`);
  }
  console.log('Search results:', data.results[0].geometry);

  return data;
};

const searchPlace = async (name: string): Promise<{ placeId: string; photoRefs: string[] }> => {
  const data = await searchPlaceApi(name);
  if (!data.results?.[0]) {
    throw new Error(`No results found for trail: ${name}`);
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

  if (placeId) {
    const photos = await fetchPlaceDetails(placeId);
    console.log(photos);

    return {
      ...coordinates,
      imageUrls: photos
        .map(p => 
          `https://places.googleapis.com/v1/${p.name}/media?max_height_px=300&max_width_px=300&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
        )
    };
  } else {
    // // console.log('Searching for place ID...');
    // const searchResult = await searchPlace(coordinates.name);
    // // console.log('Search result:', searchResult);
    // placeId = searchResult.placeId;
    // photoRefs = searchResult.photoRefs;
    return {...coordinates, imageUrls: []}
  }
};
