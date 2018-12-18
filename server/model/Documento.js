const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const documento = singleton.define('documento', {
    
    idDocumento: {
        type: sequelize.INTEGER,
        primarykey: true,
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
        referencesKey: 'ID_Timeline' // <<< Note, its a column name
      
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
});

module.exports = documento;