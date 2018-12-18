const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const studente = singleton.define('studente', {
    
    emailStudente: {
        type: sequelize.STRING,
        primarykey: true,
    },
    password: {
        type: sequelize.STRING,
    },
    nome: {
        type: sequelize.STRING,
    },
    cognome: {
        type: sequelize.STRING,
    },
    codiceFiscale: {
        type: sequelize.STRING,
    },
    via: {
        type: sequelize.STRING,
    },
    recapito: {
        type: sequelize.STRING,
    },
    facoltà: {
        type: sequelize.STRING,
    },
    matricola: {
        type: sequelize.STRING,
    },
    status: {
        type: sequelize.ENUM("partito","non partito","tornato"),
    },
});

module.exports = studente;