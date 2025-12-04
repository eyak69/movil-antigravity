const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Persona = sequelize.define('Persona', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    foto: {
        type: DataTypes.TEXT('long'), // Base64 string
        allowNull: true,
    },
    is_synced: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'personas',
    timestamps: true, // Enable createdAt and updatedAt
});

module.exports = Persona;
