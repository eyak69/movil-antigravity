const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lista = sequelize.define('Lista', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombrecorto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombrelargo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'listas',
    timestamps: false,
});

module.exports = Lista;
