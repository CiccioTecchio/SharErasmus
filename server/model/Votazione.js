const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

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

module.exports = votazione;