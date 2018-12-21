const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const timeline = singleton.define('timeline', {
    
    idTimeline: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    progresso: {
        type: sequelize.INTEGER,
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
});

module.exports = timeline;