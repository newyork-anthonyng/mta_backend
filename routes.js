const express = require('express');
const router = express.Router();
const config = require('./config');
const Mta = require('mta-gtfs');

router.get('/delays', (req, res) => {
	const mta = new Mta({
		key: config.MTA_API
	});

	mta.status().then((result) => {
		const filteredResult = filterByDelays(result);

		res.json({
			SUCCESS: true,
			result: filteredResult
		});
	});
});

function filterByDelays(info) {
	const filteredInfo = Object.assign({}, info);
	const transportationTypes = Object.keys(filteredInfo);

	transportationTypes.forEach((type) => {
		filteredInfo[type] = filterOutStatus(filteredInfo[type], 'GOOD SERVICE');
	});

	return filteredInfo;
}

function filterOutStatus(data, status) {
	const filteredData = data.filter((ele) => ele.status !== status);

	return filteredData;
}

module.exports = router;
