const createNewMta = require('./createNewMta');

function getAllStops(req, res) {
	const mta = createNewMta();
	mta.stop().then((result) => {
		const filteredResult = filterAllStopsData(result);

		res.json({
			SUCCESS: true,
			result: filteredResult
		});
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

module.exports = getAllStops;
