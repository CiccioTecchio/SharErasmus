const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const risposta = singleton.define('risposta', {
    
    ID_Risposta: {
        type: Sequelize.INTEGER,
        primarykey: true,
    },
    Risposta: {
        type: Sequelize.STRING,
    },
    Data: {
        type: Sequelize.DATEONLY,
    },
    Ora: {
        type: Sequelize.TIME,
    },
    ID_Post: {
        type: Sequelize.INTEGER,
        references: 'post', // <<< Note, its table's name, not object name
        referencesKey: 'ID_Post' // <<< Note, its a column name
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

module.exports = risposta;