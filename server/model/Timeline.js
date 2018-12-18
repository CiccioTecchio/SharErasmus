const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const timeline = singleton.define('timeline', {
    
    idTimeline: {
        type: sequelize.INTEGER,
        primarykey: true,
    },
    progresso: {
        type: sequelize.INTEGER,
    },
    emailStudente: {
        type: sequelize.STRING,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Studente' // <<< Note, its a column name
      
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
});

module.exports = timeline;