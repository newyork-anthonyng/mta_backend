const express = require('express');
const router = express.Router();
const config = require('./config');
const Mta = require('mta-gtfs');

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

	mta.stop().then((stops) => {
		const allPromises = [];
		const allSchedules = [];
		stops = {
			635: {
				stop_id: "635",
				stop_name: "14 St - Union Sq",
				stop_lat: "40.734673",
				stop_lon: "-73.989951"
			},
			636: {
				stop_id: "636",
				stop_name: "Astor Pl",
				stop_lat: "40.730054",
				stop_lon: "-73.99107"
			}
		};

		for(let stop in stops) {
			if(stops.hasOwnProperty(stop)) {
				const currentPromise = mta.schedule(Number(stop)).then((result) => {
					if(result.hasOwnProperty('schedule')) {
						for(let direction in result['schedule'][stop]) {
							let currentTrains = result['schedule'][stop][direction];

							currentTrains.forEach((train) => {
								delete train['departureTime'];
								train['direction'] = direction;
								train['stop_name'] = stops[stop]['stop_name'];
							});

							allSchedules.push(currentTrains);
						}
					}
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

module.exports = router;
