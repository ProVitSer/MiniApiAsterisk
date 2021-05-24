const { expect, assert } = require('chai');
const request = require('supertest');
const util = require('util');
const moment = require('moment');
const namiLib = require('nami');
const cdrDB = require('../models/db');
const nami = require('../models/ami');


const config = {
    host: 'http://localhost:7788',
    outboundNumber: '89104061420',
    localExtension: '565'
};
let idOriginateCall;
const startDate = moment().format('YYYY-MM-DD HH:mm:ss');
const endDate = moment().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function event(nami, action) {
    return new Promise(resolve => {
        nami.send(action, (event) => {
            resolve(event);
        });
    });
}


describe("Подключение к основным сервисам", () => {
    before(() => {
        nami.logLevel = 0;
        await nami.open();
        await sleep(5000);
        console.log(nami)
    })


    it('Проверка корректности доступности DB 3СХ', (done) => {
        cdrDB.any('SELECT current_database()')
            .then((result) => {
                assert.equal(result[0]['current_database'], 'asteriskcdrdb')
                done()
            })
            .catch((err) => done(err));
    });

    it('Проверка корректности подключения к AMI', async function() {
        const action = new namiLib.Actions.Ping();
        const result = await event(nami, action);
        expect(result.response).to.equal('Success');
    });

});

describe("Проверка API", () => {

    it(`Инифиация звонка через Asterisk`, async function() {
        const resOriginat = await request(config.host)
            .post('/api/originateCall')
            .send({ extension: config.localExtension, externalNumber: config.outboundNumber })
        expect(resOriginat.statusCode).to.equal(200);
        expect(resOriginat.body).to.have.property('id');
        expect(resOriginat.body.id).to.match(/^(\d+)$/);
        console.log(`ID вызова ${util.inspect(resOriginat.body.id)}`);
        idOriginateCall = resOriginat.body.id;

    });

    it(`Получение статистики по ID вызова`, async function() {
        await sleep(25000);
        const resultSearchCallInfo = await request(config.host)
            .post('/api/statisticsById')
            .send({ id: idOriginateCall })
        expect(resultSearchCallInfo.statusCode).to.equal(200);
        expect(resultSearchCallInfo.body).to.have.property('statisticsById');
        expect(resultSearchCallInfo.body.statisticsById.map(e => (e.source))).to.include(config.localExtension);
        expect(resultSearchCallInfo.body.statisticsById.map(e => (e.dst))).to.include(config.outboundNumber);

    });

    it(`Получение общей статистики по внешнему номеру`, async function() {
        console.log(startDate, endDate);
        const resultSearchCallInfo = await request(config.host)
            .post('/api/statisticsAll')
            .send({ externalNumber: config.outboundNumber, startDate: startDate, endDate: endDate })
        expect(resultSearchCallInfo.statusCode).to.equal(200);
        expect(resultSearchCallInfo.body).to.have.property('statisticsAll');
        expect(resultSearchCallInfo.body.statisticsAll.map(e => (e.source))).to.include(config.localExtension);
        expect(resultSearchCallInfo.body.statisticsAll.map(e => (e.dst))).to.include(config.outboundNumber);

    });

});