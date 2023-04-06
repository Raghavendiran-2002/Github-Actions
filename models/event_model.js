const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');
const Team = require('./team.js');


// ask for allowNull properties
const event = sequelize.define("event",{
    id : {
		type: DataTypes.UUID,
    	defaultValue: DataTypes.UUIDV4,
		primaryKey : true
	},
	event_name : {
        type: DataTypes.STRING,
		allowNull : false,
		unique : true 
	},
	event_description : {
		type : DataTypes.TEXT,
		//allowNull : false
	},
	start_date : {
		type : DataTypes.DATE,
		//allowNull : false
	},
	end_date : {
		type : DataTypes.DATE,
		//allowNull : false,
	},
	poster_url : {
		type : DataTypes.STRING,
		//allowNull : false,
	},
	venue : {
		type : DataTypes.STRING,
        allowNull:false,
	},
	contact_number : {
		type : DataTypes.STRING,
        allowNull : false,
	},
    Last_date_to_register : {
		type : DataTypes.DATE,
        //allowNull : false,
	},
    // test the options
    event_type : {
		type : DataTypes.INTEGER,
        allowNull : false,
		validate:{

			isIn:[[0,1,2,3]]
		},
        // 0 solo
        // 1 team
        // 2 ticketed event
        // 3 display
	},
	is_paid_event : {
		type : DataTypes.BOOLEAN,
		defaultValue : false

	},
    event_status:{
		type:DataTypes.INTEGER,
		allowNull : false,
		validate:{

			isIn:[[0,1,2,3,4]]
		},
		defaultValue : 0
        // 0 pending
        // 1 approved
        // 2 rejected
        // 3 available soon
        // 4 event closed
	},
	minimum_member : {
		type : DataTypes.INTEGER
	},
	maximum_member : {
		type : DataTypes.INTEGER
	},
    registration_url : {
		type : DataTypes.STRING,
        //allowNull : false,
	},
	capacity : {
		type : DataTypes.INTEGER,
        //allowNull : false,
	},
    price : {
		type : DataTypes.INTEGER,
        allowNull : false
	},
    form:{
        type:DataTypes.STRING,
        // //allowNull : false,
    },
    is_deleted:{
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    person_incharge : {
        type : DataTypes.STRING,
        //allowNull: false
    },
   	category : {
		type : DataTypes.STRING,
		defaultValue:"General"
   	}
}, {timestamps: true});

Team.hasMany(event);
event.belongsTo(Team);

module.exports = event;