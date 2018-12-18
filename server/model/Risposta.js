const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const risposta = singleton.define('risposta', {
    
    idRisposta: {
        type: sequelize.INTEGER,
        primarykey: true,
    },
    risposta: {
        type: sequelize.STRING,
    },
    data: {
        type: sequelize.DATEONLY,
    },
    ora: {
        type: sequelize.TIME,
    },
    idPost: {
        type: sequelize.INTEGER,
        references: 'post', // <<< Note, its table's name, not object name
        referencesKey: 'ID_Post' // <<< Note, its a column name
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

module.exports = risposta;