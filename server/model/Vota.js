const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');
let studente = require('./Studente');
let coordinatore = require('./Coordinatore');
let post = require('./Post');

const vota = singleton.define('vota', {
    
    idVoto: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    voto: {
        type: sequelize.ENUM('-1','1'),
    },
    idRisposta: {
        type: sequelize.INTEGER,
        references: 'risposta', // <<< Note, its table's name, not object name
        referencesKey: 'idRisposta' // <<< Note, its a column name
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

vota.belongsTo(studente, {targetKey:'emailStudente', foreignKey: 'emailStudente'});
vota.belongsTo(coordinatore, {targetKey:'emailCoordinatore', foreignKey:'emailCoordinatore'});
vota.belongsTo(risposta, {targetKey:'idRisposta', foreignKey:'idRisposta'});

module.exports = vota;