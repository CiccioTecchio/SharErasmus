const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const post = singleton.define('post', {
    
    ID_Post: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    post: {
        type: sequelize.STRING,
    },
    Data: {
        type: sequelize.DATEONLY,
    },
    Ora: {
        type: sequelize.TIME,
    },
    Tag: {
        type: sequelize.STRING,
    },
    Fissato: {
        type: sequelize.TINYINT,    
    },
    Email_Studente: {
        type: sequelize.STRING,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Studente' // <<< Note, its a column name
    },
    Email_Coordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
});

module.exports = post;