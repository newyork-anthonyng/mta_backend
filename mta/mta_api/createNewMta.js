const config = require('../../config');
const Mta = require('mta-gtfs');

function createNewMta() {
	return new Mta({
		key: config.MTA_API
	});
}

module.exports = createNewMta;
