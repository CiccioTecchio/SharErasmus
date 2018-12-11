const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const voto = singleton.define('voto', {
    
    ID_Voto: {
        type: Sequelize.INTEGER,
        primarykey: true,
    },
    Voto: {
        type: Sequelize.DECIMAL,
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

module.exports = voto;