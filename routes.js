const express = require('express');
const router = express.Router();
const mta_api = require('./mta/mta_api/index');

router.get('/all_stops', mta_api.getAllStops);
router.get('/delays', mta_api.getDelays);
router.get('/schedule', mta_api.getRealTimeSchedule);

module.exports = router;
