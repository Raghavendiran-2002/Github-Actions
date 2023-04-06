const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');
const User = require('./user');

const accomodation = sequelize.define("accomodation",{
	id : {
		type: DataTypes.UUID,
    	defaultValue: DataTypes.UUIDV4,
		primaryKey : true
	},
    start_date : {
        type: DataTypes.DATE,
		allowNull : false,
	},
    end_date : {
        type: DataTypes.DATE,
        allowNull : false,
    },
    allotment:{
        type: DataTypes.STRING,
        allowNull : true
    },
    team_id : {
        type : DataTypes.STRING
    },
    is_paid : {
        type: DataTypes.BOOLEAN,
        defaultValue : false
    }
}, {timestamps: true});

User.hasMany(accomodation);
accomodation.belongsTo(User);

module.exports = accomodation;