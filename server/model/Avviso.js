const sequelize = require('sequelize');
const singleton = require('../singleton/singleton.js');
let coordinatore = require('./Coordinatore');

const avviso = singleton.define('avviso', {

    idAvviso: {
        type: sequelize.INTEGER,
        primaryKey: true,
    },
    data: {
        type: sequelize.DATEONLY,
    },
    ora: {
        type: sequelize.TIME,
    },
    emailCoordinatore: {
        type: sequelize.STRING,
        references: 'coordinatore', // <<< Note, its table's name, not object name
        referencesKey: 'emailCoordinatore' // <<< Note, its a column name
    },
    avviso: {
        type: sequelize.STRING,
    },
    documentoPath: {
        type: sequelize.STRING,
    },
});

avviso.belongsTo(coordinatore, { targetKey: 'emailCoordinatore', foreignKey: 'emailCoordinatore' });


module.exports = avviso;