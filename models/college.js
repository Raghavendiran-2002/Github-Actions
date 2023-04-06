const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');

const College = sequelize.define("college", {
    id: {
        type: DataTypes.STRING,
		primaryKey : true
    },
    college_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    points : {
    	type : DataTypes.INTEGER,
    	defaultValue : 0
    }
}, {timestamps: true});

module.exports = College;