const GoogleSpreadsheet = require('google-spreadsheet');
const SPREADSHEET_KEY = require('../../config').SPREADSHEET_KEY;

const getStopsByTrainName = (trainName, cb) => {
	const doc = new GoogleSpreadsheet(SPREADSHEET_KEY);

	doc.getInfo((err, info) => {
		let sheets = info.worksheets;
		let sheet = sheets.filter((sheet) => sheet.title == trainName);

		if(!sheet[0]) {
			cb(null);
		}

		sheet[0].getRows({}, (err, rows) => {
			const allStops = {};

			rows.forEach((row) => {
				allStops[row.stopid] = row.stopname;
			});

			cb(allStops);
		});
	});
};

module.exports = getStopsByTrainName;
