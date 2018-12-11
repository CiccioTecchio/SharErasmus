const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const studente = singleton.define('studente', {
    
    Email_Studente: {
        type: Sequelize.STRING,
        primarykey: true,
    },
    Password: {
        type: Sequelize.STRING,
    },
    Nome: {
        type: Sequelize.STRING,
    },
    Cognome: {
        type: Sequelize.STRING,
    },
    Codice_Fiscale: {
            type: Sequelize.STRING,
    },
    Via: {
            type: Sequelize.STRING,
    },
    Recapito: {
        type: Sequelize.STRING,
    },
    Facoltà: {
        type: Sequelize.STRING,
    },
    Matricola: {
        type: Sequelize.STRING,
    },
    Status: {
        type: Sequelize.ENUM,
    },
});

module.exports = studente;