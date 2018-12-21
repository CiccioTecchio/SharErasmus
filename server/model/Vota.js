const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const voto = singleton.define('voto', {
    
    idVoto: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    voto: {
        type: sequelize.DECIMAL,
    },
    idPost: {
        type: sequelize.INTEGER,
        references: 'post', // <<< Note, its table's name, not object name
        referencesKey: 'idPost' // <<< Note, its a column name
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

module.exports = voto;