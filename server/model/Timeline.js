const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const timeline = singleton.define('timeline', {
    
    ID_Timeline: {
        type: Sequelize.INTEGER,
        primarykey: true,
    },
    Progresso: {
        type: Sequelize.INTEGER,
    },
    Email_Studente: {
            type: Sequelize.STRING,
            references: 'studente', // <<< Note, its table's name, not object name
            referencesKey: 'Email_Studente' // <<< Note, its a column name
      
    },
    Email_Coordinatore: {
            type: Sequelize.STRING,
            references: 'coordinatore', // <<< Note, its table's name, not object name
            referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
});

module.exports = timeline;