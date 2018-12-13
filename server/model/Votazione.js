const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const votazione = singleton.define('votazione', {
    

    idTimeline: {
        type: sequelize.INTEGER,
        primarykey: true,
        references: 'timeline', // <<< Note, its table's name, not object name
        referencesKey: 'ID_Timeline' // <<< Note, its a column name
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        primarykey: true,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
    nomeEsame: {
        type: sequelize.STRING,
    },
    voto: {
        type: sequelize.INTEGER,
    },
});

module.exports = votazione;