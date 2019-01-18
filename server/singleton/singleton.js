const Sequelize = require('sequelize');
const db = require('./db.json');
let sequelize = new Sequelize('progetto', db.username, db.password, {
    host : db.host,
    dialect: 'mysql',
    define: {
        timestamps: false, //utile per non permenttere la aggiunta di info inutili nelle entità
        freezeTableName:true,                                                                                                                                                                                       
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    operatorsAliases: false
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;