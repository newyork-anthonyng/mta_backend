const createNewMta = require('./createNewMta');

function getDelays(req, res) {
	const mta = createNewMta();

	mta.status().then((result) => {
		const filteredResult = filterByDelays(result);

		res.json({
			SUCCESS: true,
			result: filteredResult
		});
	});
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

module.exports = getDelays;
