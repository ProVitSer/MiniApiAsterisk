"use strict";
const nami = require('../models/ami'),
    logger = require(`../logger/logger`),
    util = require('util'),
    config = require(`../config/config`);


nami.on(`namiConnectionClose`, function(data) {
    logger.error(`Переподключение к AMI ...`);
    setTimeout(function() {
        nami.open();
    }, 5000);
});

nami.on(`namiInvalidPeer`, function(data) {
    logger.error(`Invalid AMI Salute. Not an AMI?`);
    process.exit();
});
nami.on(`namiLoginIncorrect`, function() {
    logger.error(`Некорректный логин или пароль от AMI`);
    process.exit();
});
nami.on('namiConnected', function(event) {
    logger.info(`Подключение к AMI успешно установлено`);
})

//Event о завершение исходящего вызова по исходящему контексту. Сохраняется в лог для дублирования статистики на случай сбоев cdr
nami.on('namiEventNewexten', (event) => {
    if (event.context == config.context.handlerOutgoingCall &&
        event.application == 'NoOp'
    ) {
        logger.info(`Завершился исходящие вызов на Asterisk ${util.inspect(JSON.parse(event.appdata))}`);
    }
});

nami.logLevel = 0;
nami.open();