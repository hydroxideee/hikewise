import { GOOGLE_PLACES_API_KEY } from '@env';
import * as fs from 'fs';
import * as path from 'path';
import { KNOWN_TRAILS } from './knownTrails';

export async function fetchPlaceIds(): Promise<void> {
    const updatedTrails = [...KNOWN_TRAILS];
    
    for (const trail of updatedTrails) {
      try {
        const searchQuery = `${trail.name} trail UK`;
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          trail.place_id = data.results[0].place_id;
        }
      } catch (error) {
        console.error(`Failed to fetch place ID for ${trail.name}:`, error);
      }
    }

    // Generate the new file content
    const fileContent = `
export interface TrailCoordinates {
  name: string;
  latitude: number;
  longitude: number;
  place_id?: string;
}

export const KNOWN_TRAILS: TrailCoordinates[] = ${JSON.stringify(updatedTrails, null, 2)};
`;

    // Write the updated content back to knownTrails.ts
    const filePath = path.join(__dirname, 'knownTrails.ts');
    fs.writeFileSync(filePath, fileContent);
    console.log('Successfully updated knownTrails.ts with place IDs');
}

fetchPlaceIds();
