const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const coordinatore = singleton.define('coordinatore', {
    
    emailCoordinatore: {
        type: sequelize.STRING,
        primaryKey: true
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
    ruolo: {
        type: sequelize.STRING,
    },
    facolta: {
        type: sequelize.STRING,
    },
    bio: {
        type: sequelize.STRING,
    },
    imgProfiloPath: {
        type: sequelize.STRING,
    },
    passToken: {
        type: sequelize.STRING,
    }
});

module.exports = coordinatore;