const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const studente = singleton.define('studente', {
    
    emailStudente: {
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
    facolta: {
        type: sequelize.STRING,
    },
    matricola: {
        type: sequelize.STRING,
    },
    status: {
        type: sequelize.ENUM('Normale', 'Partito', 'Tornato'),
    },
    bio: {
        type: sequelize.STRING,
    },
    imgProfiloPath: {
        type: sequelize.STRING,
    },
    passToken: {
        type: sequelize.STRING,
    },
    rating: {
        type: sequelize.INTEGER,
    }
    
});

module.exports = studente;