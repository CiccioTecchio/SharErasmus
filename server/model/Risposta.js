const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');
let studente = require('./Studente');
let coordinatore = require('./Coordinatore');
let post = require('./Post');

const risposta = singleton.define('risposta', {
    
    idRisposta: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    risposta: {
        type: sequelize.STRING,
    },
    data: {
        type: sequelize.DATEONLY,
    },
    ora: {
        type: sequelize.TIME,
    },
    idPost: {
        type: sequelize.INTEGER,
        references: 'post', // <<< Note, its table's name, not object name
        referencesKey: 'idPost' // <<< Note, its a column name
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

risposta.belongsTo(studente, {targetKey:'emailStudente', foreignKey: 'emailStudente'});
risposta.belongsTo(coordinatore, {targetKey:'emailCoordinatore', foreignKey:'emailCoordinatore'});
risposta.belongsTo(post, {targetKey:'idPost', foreignKey:'idPost'});

module.exports = risposta;