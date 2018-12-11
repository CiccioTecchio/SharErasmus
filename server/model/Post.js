const Sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');

const post = singleton.define('post', {
    
    ID_Post: {
        type: Sequelize.INTEGER,
        primarykey: true,
    },
    Data: {
        type: Sequelize.DATEONLY,
    },
    Ora: {
        type: Sequelize.TIME,
    },
    Tag: {
        type: Sequelize.STRING,
    },
    Fissato: {
            type: Sequelize.TINYINT,    
    },
    Email_Studente: {
        type: Sequelize.STRING,
        references: 'studente', // <<< Note, its table's name, not object name
        referencesKey: 'Email_Studente' // <<< Note, its a column name
    },
    Email_Coordinatore: {
            type: Sequelize.STRING,
            references: 'coordinatore', // <<< Note, its table's name, not object name
            referencesKey: 'Email_Coordinatore' // <<< Note, its a column name
    },
});

module.exports = post;