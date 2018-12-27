const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');
let timeline = require('./Timeline');
let coordinatore = require('./Coordinatore');

const votazione = singleton.define('votazione', {
    

    idTimeline: {
        type: sequelize.INTEGER,
        primaryKey: true,
        references: 'timeline', // <<< Note, its table's name, not object name
        referencesKey: 'idTimeline' // <<< Note, its a column name
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        primaryKey: true,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'emailCoordinatore' // <<< Note, its a column name
    },
    nomeEsame: {
        type: sequelize.STRING,
    },
    voto: {
        type: sequelize.INTEGER,
    },
});

votazione.belongsTo(timeline, {targetKey:'idTimeline', foreignKey: 'idTimeline'});
votazione.belongsTo(coordinatore, {targetKey:'emailCoordinatore', foreignKey:'emailCoordinatore'});


module.exports = votazione;