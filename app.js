/* eslint-disable no-unused-expressions */
"use strict"; // eslint-disable-line
const express = require('express'),
    app = express(),
    util = require('util'),
    logger = require('./logger/logger'),
    nami = require('./src/event');

const apiRouter = require('./routes/apiRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', apiRouter);

app.use((req, res, next) => {
    logger.info(`Получили запрос на инициацию вызова со стороны CRM ${util.inspect(req.body)}`);
    next();
});

app.use(function(req, res, next) {
    res.status(404).end();
});

app.listen(7788, () => {
    logger.info(`Сервер слушается на  http://localhost:7755`);
});