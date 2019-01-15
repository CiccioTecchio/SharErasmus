const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');
let timeline = require('./Timeline');
let studente = require('./Studente');

const votazione = singleton.define('votazione', {
    

    idTimeline: {
        type: sequelize.INTEGER,
        primaryKey: true,
        references: 'timeline', // <<< Note, its table's name, not object name
        referencesKey: 'idTimeline' // <<< Note, its a column name
    },
    emailStudente: {
        type: sequelize.STRING,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'emailStudente' // <<< Note, its a column name
    },
    nomeEsame: {
        type: sequelize.STRING,
        primaryKey: true
    },
    votoIta: {
        type: sequelize.INTEGER,
    },
    esameEstero: {
        type: sequelize.STRING,
    },
    votoEstero: {
        type: sequelize.STRING,
    },
});

votazione.belongsTo(timeline, {targetKey:'idTimeline', foreignKey: 'idTimeline'});
votazione.belongsTo(studente, {targetKey:'emailStudente', foreignKey:'emailStudente'});


module.exports = votazione;