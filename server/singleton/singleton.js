const Sequelize = require('sequelize');

let sequelize = new Sequelize('progetto', 'root', '', {
    host: "localhost",
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