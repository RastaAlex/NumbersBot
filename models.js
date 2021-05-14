const sequelize = require('./db');
const {DataTypes} = require(sequelize);

const user = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    
})