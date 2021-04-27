"use strict";
const config = require(`../config/config`),
    namiLib = require(`nami`);

const namiConfig = {
    host: config.ami.host,
    port: config.ami.port,
    username: config.ami.username,
    secret: config.ami.secret
};

let nami = new namiLib.Nami(namiConfig);

module.exports = nami;