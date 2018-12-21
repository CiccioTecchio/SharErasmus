const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const post = singleton.define('post', {
    
    idPost: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    data: {
        type: sequelize.DATEONLY,
    },
    ora: {
        type: sequelize.TIME,
    },
    tag: {
        type: sequelize.STRING,
    },
    fissato: {
        type: sequelize.TINYINT,    
    },
    emailStudente: {
        type: sequelize.STRING,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'emailStudente' // <<< Note, its a column name
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'emailCoordinatore' // <<< Note, its a column name
    },
});

module.exports = post;