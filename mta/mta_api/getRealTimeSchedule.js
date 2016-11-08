const createNewMta = require('./createNewMta');
const mta_sheets = require('../mta_sheets/index');

function getRealTimeSchedule (req, res) {
	mta_sheets.getStopsByTrainName(6, (result) => {
		res.json({
			SUCCESS: true,
			result: result
		});
	});
};

module.exports = getRealTimeSchedule;
