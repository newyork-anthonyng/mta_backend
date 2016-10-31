const express = require('express');
const app = express();
const logger = require('morgan');
const mtaRoutes = require('./routes');

app.use('/mta', mtaRoutes);
app.use(logger('dev'));

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on ${server.address().port}`);
});

module.exports = app;
