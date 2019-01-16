const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');
let studente = require('./Studente');
let coordinatore = require('./Coordinatore');

const timeline = singleton.define('timeline', {
    
    idTimeline: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    emailStudente: {
        type: sequelize.STRING,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'emailStudente' // <<< Note, its a column name
      
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'emailCoordinatore' // <<< Note, its a column name
    },
    citta: {
        type: sequelize.STRING
    },
    nazione: {
        type: sequelize.STRING
    }

});

timeline.belongsTo(studente, {targetKey:'emailStudente', foreignKey: 'emailStudente'});
timeline.belongsTo(coordinatore, {targetKey:'emailCoordinatore', foreignKey:'emailCoordinatore'});

module.exports = timeline;