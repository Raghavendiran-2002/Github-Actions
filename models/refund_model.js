const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');
const User = require('./user');
const Event = require('./event_model');

const refund = sequelize.define("refund", {
    id: {
		type: DataTypes.UUID,
    	defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tnx_id: {
        type: DataTypes.STRING,
        // allowNull: false
    },
	amount : {
		type  :DataTypes.INTEGER,
        allowNull: false
	}
}, {timestamps: true});

// two associations

// user and answer model
User.hasMany(refund);
refund.belongsTo(User);

// question and answer model
Event.hasMany(refund);
refund.belongsTo(Event);

module.exports = refund;