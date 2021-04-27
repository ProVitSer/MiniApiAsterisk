"use strict";
const express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    util = require('util'),
    pg = require('../src/pg'),
    call = require('../src/call'),
    logger = require('../logger/logger');

router.put(`/api/originateCall`, async(req, res, next) => {
    try {
        const { extension, externalNumber } = req.body;
        const linkedid = moment().unix();
        await call.sendAmiCall(res, extension, externalNumber, linkedid);
    } catch (e) {
        logger.error(`Ошибка инициализации вызова из CRM  ${util.inspect(e)}`);
        return res.status(503).send(e.message);
    }
});


router.put(`/api/statisticsAll`, async(req, res, next) => {
    try {
        const { externalNumber, startDate, endDate } = req.body;
        const statisticsAll = await pg.searchAllInfoByDateNumber(externalNumber, startDate, endDate);
        res.status(200).json({ statisticsAll });
        logger.info(statisticsAll);
    } catch (e) {
        logger.error(`Запроса статистики по номеру и дате  ${util.inspect(e)}`);
        return res.status(503).send(e.message);
    }
});

router.put(`/api/statisticsById`, async(req, res, next) => {
    try {
        const { id } = req.body;
        const statisticsById = await pg.searchAllInfoById(id);
        res.status(200).json({ statisticsById });
        logger.info(statisticsById);
    } catch (e) {
        logger.error(`Запроса статистики по ID ${util.inspect(e)}`);
        return res.status(503).send(e.message);
    }
});

module.exports = router;