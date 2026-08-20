import { ApiResponse } from '../common/index.js';
import mapService from '../services/map.service.js';

class MapController {
  constructor() {
    this.getAutocomplete = this.getAutocomplete.bind(this);
    this.getPlaceDetails = this.getPlaceDetails.bind(this);
  }

  async getAutocomplete(req, res, next) {
    try {
      const { input, lang = 'en' } = req.query;
      const predictions = await mapService.getAutocomplete(input, lang);
      return new ApiResponse(res).success({ data: predictions });
    } catch (e) { next(e); }
  }

  async getPlaceDetails(req, res, next) {
    try {
      const { placeId } = req.query;
      const details = await mapService.getPlaceDetails(placeId);
      return new ApiResponse(res).success({ data: details });
    } catch (e) { next(e); }
  }
}

export default new MapController();
