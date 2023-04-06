const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');

const team = sequelize.define("team", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    team_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    team_description : {
    	type : DataTypes.TEXT,
    	defaultValue : ""
    },
    instagram_url : {
    	type : DataTypes.TEXT,
    	defaultValue : ""
    },
    logo_url : {
    	type : DataTypes.TEXT,
    	defaultValue : ""
    },
    is_deleted : {
    	type : DataTypes.BOOLEAN,
    	defaultValue : false
    }
}, {timestamps: true});

module.exports = team;
