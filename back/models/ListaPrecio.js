const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Producto = require('./Producto');
const Lista = require('./Lista');
const Moneda = require('./Moneda');

const ListaPrecio = sequelize.define('ListaPrecio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        }
    },
    listaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lista,
            key: 'id'
        }
    },
    monedaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Moneda,
            key: 'id'
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fechaAlta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    fechaBaja: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'listaprecios',
    timestamps: false, // We handle fechaAlta manually/via default, and no updatedAt needed in this logic
});

// Define Associations
ListaPrecio.belongsTo(Producto, { foreignKey: 'productoId' });
ListaPrecio.belongsTo(Lista, { foreignKey: 'listaId' });
ListaPrecio.belongsTo(Moneda, { foreignKey: 'monedaId' });

module.exports = ListaPrecio;
