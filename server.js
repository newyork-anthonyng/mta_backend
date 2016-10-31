const express = require('express');
const app = express();
const logger = require('morgan');
const config = require('./config');

app.use(logger('dev'));

app.get('/all', (req, res) => {
	console.log('mta api: ' + config.MTA_API);
	res.json({ SUCCESS: true });
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on ${server.address().port}`);
});

module.exports = app;
