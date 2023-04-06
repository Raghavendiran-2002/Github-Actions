const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');
const Event = require('./event_model');
const User = require('./user');

const transaction = sequelize.define("transaction", {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    for_registration: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    for_accomodation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    points : {
    	type : DataTypes.INTEGER,
    	defaultValue : 0
    }
}, {timestamps: true});

// two foriegn keys

// event and transaction model
Event.hasMany(transaction);
transaction.belongsTo(Event);

// user and transaction model
User.hasMany(transaction);
transaction.belongsTo(User);

module.exports = transaction;