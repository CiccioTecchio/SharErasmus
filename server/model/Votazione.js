const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const votazione = singleton.define('votazione', {
    

    ID_Timeline: {
        type: Sequelize.INTEGER,
        primarykey: true,
        references: 'timeline', // <<< Note, its table's name, not object name
        referencesKey: 'ID_Timeline' // <<< Note, its a column name
    },
    Email_Studente: {
        type: Sequelize.STRING,
        primarykey: true,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Studente' // <<< Note, its a column name
    },
    Nome_Esame: {
            type: Sequelize.STRING,
    },
    Voto: {
        type: Sequelize.INTEGER,
},
});

module.exports = votazione;