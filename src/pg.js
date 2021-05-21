"use strict";
const db = require('../models/db'),
    logger = require('../logger/logger'),
    util = require('util');

//Выгрузка из DB CDR по внешнему номеру и диапазону времени с преобразование UCT +3 и постановкой URL сервера
async function searchAllInfoByDateNumber(externalNumber, startDate, endDate) {
    try {
        logger.info(`select to_char(start + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as start, to_char(endcall + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as endcall,source,dst,duration,callsec as billsec,disposition,linkedid,CONCAT('http://178.20.45.20/',recordingfile ) as recordingfile from public.cdr where dst like '%${externalNumber}' and (dcontext like 'crm-external' or dcontext like '3cx') and start between '${startDate}' and '${endDate}' `);
        const callInfo = await db.any(`select to_char(start + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as start, to_char(endcall + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as endcall,source,dst,duration,callsec as billsec,disposition,linkedid,CONCAT('http://178.20.45.20/',recordingfile ) as recordingfile from public.cdr where dst like '%${externalNumber}' and (dcontext like 'crm-external' or dcontext like '3cx') and start between '${startDate}' and '${endDate}' `);
        logger.info(`searchAllInfoByDateNumber ${util.inspect(callInfo)}`);
        return callInfo;
    } catch (e) {
        return e;
    }
}

//Выгрузка из DB CDR по ID канала с преобразование UCT +3 и постановкой URL сервера
async function searchAllInfoById(id) {
    try {
        logger.info(`select to_char(start + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as start,to_char(endcall + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as endcall,source,dst,duration,callsec as billsec,disposition,linkedid,CONCAT('http://178.20.45.20/',recordingfile ) as recordingfile from public.cdr where linkedid like '${id}' and dcontext like 'crm-external'`);
        const callInfo = await db.any(`select to_char(start + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as start,to_char(endcall + interval '3 hour','YYYY-mm-dd HH24:MI:SS') as endcall,source,dst,duration,callsec as billsec,disposition,linkedid,CONCAT('http://178.20.45.20/',recordingfile ) as recordingfile from public.cdr where linkedid like '${id}' and dcontext like 'crm-external'`);
        logger.info(`searchAllInfoById ${util.inspect(callInfo)}`);
        return callInfo;
    } catch (e) {
        return e;
    }
}

module.exports = { searchAllInfoByDateNumber, searchAllInfoById };