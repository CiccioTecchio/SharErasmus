const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const coordinatore = singleton.define('coordinatore', {
    
    Email_coordinatore: {
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
    Ruolo: {
        type: Sequelize.STRING,
    },
    

});

module.exports = coordinatore;