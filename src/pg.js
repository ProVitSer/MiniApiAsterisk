"use strict";
const db = require('../models/db'),
    logger = require('../logger/logger'),
    util = require('util');

async function searchAllInfoByDateNumber(externalNumber, startDate, endDate) {
    try {
        let callInfo = await db.any(`select start,answer,endcall,source,dst,duration,billsec,disposition,linkedid,recordingfile from public.cdr where dst like '%${externalNumber}' and (dcontext like 'crm-external' or dcontext like '3cx') and start between '${startDate}' and '${endDate}' `);
        logger.info(`searchAllInfoByDateNumber ${util.inspect(callInfo)}`);
        return callInfo;
    } catch (e) {
        return e;
    }
};

async function searchAllInfoById(id) {
    try {
        let callInfo = await db.any(`select start,answer,endcall,source,dst,duration,billsec,disposition,linkedid,recordingfile from public.cdr where linkedid like '${id}' and dcontext like 'crm-external'`);
        logger.info(`searchAllInfoById ${util.inspect(callInfo)}`);
        return callInfo;
    } catch (e) {
        return e;
    }
};
module.exports = { searchAllInfoByDateNumber, searchAllInfoById };