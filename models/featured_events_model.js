const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');
const Event = require('./event_model');

const featuredEvent = sequelize.define("featuredevent", {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    banner_url: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    
}, {timestamps: true});

Event.hasMany(featuredEvent);
featuredEvent.belongsTo(Event);

module.exports = featuredEvent;