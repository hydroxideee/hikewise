export const tempTip = (temp: number): string =>
  temp < 12
    ? "Consider bringing warm clothes"
    : temp < 20
    ? "Ideal for hiking!"
    : "It's hot out - hydrate well";

export const cloudCoverTip = (cloudCover: number): string =>
  cloudCover <= 33
    ? "Sunny, bring sun protection"
    : cloudCover <= 66
    ? "Partly cloudy, pleasant"
    : "Overcast, good for shade";

export const precipitationTip = (precip: number): string =>
  precip <= 15
    ? "Dry to light drizzle expected"
    : precip <= 40
    ? "Some rain possible, consider precautions"
    : precip <= 75
    ? "Rain expected, wear waterproofs"
    : "Heavy rain expected";

export const windTip = (wind: number): string =>
  wind <= 19
    ? "Calm, enjoyable breeze"
    : wind <= 38
    ? "Breezy, watch your hat"
    : "Windy, challenging conditions";
