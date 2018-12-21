const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const documento = singleton.define('documento', {
    
    idDocumento: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    tipo: {
        type: sequelize.STRING,
    },
    titolo: {
        type: sequelize.STRING,
    },
    contenuto: {
        type: sequelize.BLOB,
    },
    idTimeline: {
        
        type: sequelize.INTEGER,
        references: 'timeline', // <<< Note, its table's name, not object name
        referencesKey: 'idTimeline' // <<< Note, its a column name
      
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'emailCoordinatore' // <<< Note, its a column name
    },
});

module.exports = documento;