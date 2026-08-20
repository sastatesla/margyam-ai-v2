import express from 'express';
import mapController from '../controllers/map.controller.js';

const router = express.Router();

router.get('/autocomplete',    mapController.getAutocomplete);
router.get('/place-details',   mapController.getPlaceDetails);

export default router;
