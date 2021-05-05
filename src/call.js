"use strict";
const namiLib = require('nami'),
    nami = require('../models/ami'),
    util = require('util'),
    logger = require('../logger/logger'),
    config = require(`../config/config`);

//Инициация вызова через AMI Asterisk. {внутренний номер, внешний номер, генерируемый id канала}
async function sendAmiCall(res, extension, externalNumber, linkedid) {
    const action = new namiLib.Actions.Originate();
    action.channel = `local/${extension}:${externalNumber}@${config.context.crmBridgeLocal3CX}`;
    action.callerid = externalNumber;
    action.priority = '1';
    action.timeout = '180000';
    action.context = config.context.crmBridgeExternal3CX;
    action.exten = externalNumber;
    action.variable = `var1=${extension}`;
    action.channelid = `${linkedid}`;
    action.async = 'yes';
    logger.info(action);
    nami.send(action, (response) => {
        logger.info(` ---- Response: ${util.inspect(response)}`);
        (response.response == 'Success') ? res.status(200).json({ id: linkedid }): res.status(503).json({ id: linkedid });
    });
    return '';
}

module.exports = { sendAmiCall };