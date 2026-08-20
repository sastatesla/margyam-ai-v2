import axios from 'axios';

class MapService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 1000 * 60 * 60; // 1 hour
  }

  async getAutocomplete(input, lang = 'en') {
    const cacheKey = `autocomplete:${lang}:${input}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) return cached.data;
    }

    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) return [];

      const res = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: { input, language: lang, types: '(cities)', key: apiKey },
      });

      if (res.data.status === 'OK') {
        this.cache.set(cacheKey, { data: res.data.predictions, timestamp: Date.now() });
        return res.data.predictions;
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  async getPlaceDetails(placeId) {
    const cacheKey = `details:${placeId}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) return cached.data;
    }

    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) return null;

      const res = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: { place_id: placeId, fields: 'geometry,formatted_address,name', key: apiKey },
      });

      if (res.data.status === 'OK') {
        const result = res.data.result;
        const details = {
          lat: result.geometry.location.lat,
          lon: result.geometry.location.lng,
          name: result.name,
          formattedAddress: result.formatted_address,
        };
        this.cache.set(cacheKey, { data: details, timestamp: Date.now() });
        return details;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

export default new MapService();
