const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const risposta = singleton.define('risposta', {
    
    ID_Risposta: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    Risposta: {
        type: sequelize.STRING,
    },
    Data: {
        type: sequelize.DATEONLY,
    },
    Ora: {
        type: sequelize.TIME,
    },
    ID_Post: {
        type: sequelize.INTEGER,
        references: 'post', // <<< Note, its table's name, not object name
        referencesKey: 'ID_Post' // <<< Note, its a column name
    },
    Email_Studente: {
        type: sequelize.STRING,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Studente' // <<< Note, its a column name
    },
    Email_Coordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
});

module.exports = risposta;