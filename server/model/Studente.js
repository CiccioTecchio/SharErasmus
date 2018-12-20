const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const studente = singleton.define('studente', {
    
    Email_Studente: {
        type: sequelize.STRING,
        primaryKey: true
    },
    Password: {
        type: sequelize.STRING,
    },
    Nome: {
        type: sequelize.STRING,
    },
    Cognome: {
        type: sequelize.STRING,
    },
    Codice_Fiscale: {
        type: sequelize.STRING,
    },
    Via: {
        type: sequelize.STRING,
    },
    Recapito: {
        type: sequelize.STRING,
    },
    Facoltà: {
        type: sequelize.STRING,
    },
    Matricola: {
        type: sequelize.STRING,
    },
    Status: {
        type: sequelize.ENUM('Normale', 'Partito', 'Tornato'),
    },
    bio: {
        type: sequelize.STRING,
    },
});

module.exports = studente;