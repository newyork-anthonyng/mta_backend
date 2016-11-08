const createNewMta = require('./createNewMta');
const mta_sheets = require('../mta_sheets/index');

function getRealTimeSchedule (req, res) {
	mta_sheets.getStopsByTrainName(6, (stops) => {
		const stopKeys = Object.keys(stops);
		const allPromises = getScheduleForStops(stopKeys);

		Promise.all(allPromises).then((schedules) => {
			res.json({
				SUCCESS: true,
				result: formatScheduleAndStops(schedules, stops)
			});
		});
	});
};

function getScheduleForStops(stops) {
	const mta = createNewMta();
	const allPromises = [];

	stops.forEach((stop) => {
		if(isValidStop(stop)) {
			const currentPromise = mta.schedule(+stop).then((schedule) => {
				return schedule;
			});
			allPromises.push(currentPromise);
		}
	});

	return allPromises;
}

function isValidStop(stop) {
	return !isNaN(+stop);
}

function formatScheduleAndStops(schedules, stops) {
	const formattedSchedule = [];

	schedules.forEach((schedule) => {
		const currentStopId = Object.keys(schedule.schedule)[0];
		const stopName = stops[currentStopId];
		const northboundTime = schedule.schedule[currentStopId]['N'][0]['arrivalTime'];
		const southboundTime = schedule.schedule[currentStopId]['S'][0]['arrivalTime'];

		formattedSchedule.push({
			id: currentStopId,
			name: stopName,
			northboundTime,
			southboundTime
		});
	});

	return formattedSchedule;
}

module.exports = getRealTimeSchedule;
