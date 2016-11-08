const express = require('express');
const router = express.Router();
const config = require('./config');
const Mta = require('mta-gtfs');
const six = require('./data/06');

router.get('/all_stops', (req, res) => {
	const mta = createNewMta();
	mta.stop().then((result) => {
		const filteredResult = filterAllStopsData(result);

		res.json({
			SUCCESS: true,
			result: filteredResult
		});
	});
});

router.get('/delays', (req, res) => {
	const mta = createNewMta();

	mta.status().then((result) => {
		const filteredResult = filterByDelays(result);

		res.json({
			SUCCESS: true,
			result: filteredResult
		});
	});
});

router.get('/test', (req, res) => {
	const mta = createNewMta();

	mta.schedule(635).then((result) => {
		res.json({
			result: result
		});
	});
});

router.get('/schedule', (req, res) => {
	const mta = createNewMta();
	const allPromises = [];
	const allSchedules = [];
	stops = six;

	for(let i = 0; i < stops.length; i++) {
		if(isValidStop(stops[i])) {
			const currentPromise = mta.schedule(+stops[i]).then((result) => {
				allSchedules.push(result);
			});
			allPromises.push(currentPromise);
		}
	}
	Promise.all(allPromises).then(values => {
		res.json({
			SUCCESS: true,
			result: allSchedules
		});
	});
});

function createNewMta() {
	return new Mta({
		key: config.MTA_API
	});
}

function filterAllStopsData(info) {
	const filteredInfo = Object.assign({}, info);

	for(let stop in filteredInfo) {
		if(filteredInfo.hasOwnProperty(stop)) {
			const currentStop = filteredInfo[stop];

			const updatedInfo = {
				stop_id: currentStop.stop_id,
				stop_name: currentStop.stop_name,
				stop_lat: currentStop.stop_lat,
				stop_lon: currentStop.stop_lon
			};
			filteredInfo[stop] = updatedInfo;
		}
	}

	return filteredInfo;
}

function filterByDelays(info) {
	const filteredInfo = Object.assign({}, info);

	for(let type in filteredInfo) {
		if(filteredInfo.hasOwnProperty(type)) {
			filteredInfo[type] = filterOutStatus(filteredInfo[type], 'GOOD SERVICE');
		}
	}

	return filteredInfo;
}

function filterOutStatus(data, status) {
	const filteredData = data.filter((ele) => ele.status !== status);

	return filteredData;
}

function isValidStop(stop) {
	return !isNaN(+stop);
}

module.exports = router;
