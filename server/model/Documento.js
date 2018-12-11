const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const documento = singleton.define('documento', {
    
    ID_Documento: {
        type: Sequelize.INTEGER,
        primarykey: true,
    },
    Tipo: {
        type: Sequelize.STRING,
    },
    Titolo: {
        type: Sequelize.STRING,
    },
    Contenuto: {
        type: Sequelize.BLOB,
    },
    ID_Timeline: {
        
            type: Sequelize.INTEGER,
            references: 'timeline', // <<< Note, its table's name, not object name
            referencesKey: 'ID_Timeline' // <<< Note, its a column name
      
    },
    Email_Coordinatore: {
            type: Sequelize.STRING,
            references: 'coordinatore', // <<< Note, its table's name, not object name
            referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
});

module.exports = documento;