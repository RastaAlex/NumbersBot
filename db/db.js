const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telegramBot',
    'root',
    'root',
    {
        host: '5.188.128.98',
        port: '6432',
        dialect: 'postgres'
    }
)