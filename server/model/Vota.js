const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const voto = singleton.define('voto', {
    
    idVoto: {
        type: sequelize.INTEGER,
        primarykey: true,
    },
    voto: {
        type: sequelize.DECIMAL,
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

module.exports = voto;