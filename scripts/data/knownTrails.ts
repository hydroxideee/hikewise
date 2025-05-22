
export interface TrailCoordinates {
  name: string;
  latitude: number;
  longitude: number;
  place_id?: string;
}

export const KNOWN_TRAILS: TrailCoordinates[] = [
  { name: "Cleveland Way", latitude: 54.24722, longitude: -1.05861 },
  { name: "Cotswold Way", latitude: 52.05200, longitude: -1.77900 },
  { name: "Coast to Coast Walk", latitude: 54.49200, longitude: -3.59000 },
  { name: "Glyndŵr's Way", latitude: 52.34400, longitude: -3.05000 },
  { name: "Hadrian's Wall Path", latitude: 54.99100, longitude: -1.53400 },
  { name: "North Downs Way", latitude: 51.21500, longitude: -0.79900 },
  { name: "Offa's Dyke Path", latitude: 51.63240, longitude: -2.64820 },
  { name: "Peddars Way", latitude: 52.38800, longitude: 0.86700 },
  { name: "Norfolk Coast Path", latitude: 52.93100, longitude: 1.30200 },
  { name: "Pembrokeshire Coast Path", latitude: 52.10400, longitude: -4.69900 },
  { name: "Pennine Bridleway", latitude: 53.10300, longitude: -1.59200 },
  { name: "Pennine Way", latitude: 53.36600, longitude: -1.81600 },
  { name: "The Ridgeway", latitude: 51.41000, longitude: -1.83173 },
  { name: "South Downs Way", latitude: 51.06320, longitude: -1.30800 },
  { name: "South West Coast Path", latitude: 51.20400, longitude: -3.48100 },
  { name: "Thames Path", latitude: 51.68300, longitude: -2.01700 },
  { name: "Yorkshire Wolds Way", latitude: 53.72390, longitude: -0.43190 },
  { name: "Capital Ring", latitude: 51.49990, longitude: 0.06160 },
  { name: "Esk Valley Walk", latitude: 54.46715, longitude: -0.94675 },
  { name: "Lea Valley Walk", latitude: 51.90300, longitude: -0.46600 },
  { name: "London Outer Orbital Path (LOOP)", latitude: 51.48160, longitude: 0.17540 },
  { name: "Peak District Boundary Walk", latitude: 53.25900, longitude: -1.91100 },
  { name: "Shakespeare's Way", latitude: 52.19170, longitude: -1.70730 },
  { name: "Vanguard Way", latitude: 51.48290, longitude: -0.00970 },
  { name: "Wales Coast Path", latitude: 52.41510, longitude: -4.08310 },
  { name: "Yorkshire Water Way", latitude: 53.80130, longitude: -1.54860 },
  { name: "Ulster Way", latitude: 54.60787, longitude: -5.92644 }
];
