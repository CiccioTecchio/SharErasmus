const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const coordinatore = singleton.define('coordinatore', {
    
    Email_Coordinatore: {
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
    Ruolo: {
        type: sequelize.STRING,
    },
    facolta: {
        type: sequelize.STRING,
    },
    

});

module.exports = coordinatore;