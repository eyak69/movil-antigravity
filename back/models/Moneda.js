const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Moneda = sequelize.define('Moneda', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    simbolo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'monedas',
    timestamps: false,
});

module.exports = Moneda;
