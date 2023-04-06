const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');
const bcrypt = require('bcryptjs')
// const College = require('./college');

const admin = sequelize.define("admin",{
	username : {
        type: DataTypes.STRING,
		primaryKey : true,
		allowNull : false
	},
	password : {
		type: DataTypes.STRING
    	// defaultValue: DataTypes.UUIDV4,
	},
	role : {
		type : DataTypes.STRING,
		values : ['superadmin','clubadmin']
		// defaultValue : 'user'
	},
	clubname : {
		type : DataTypes.STRING
	}
}, {timestamps: true});

admin.beforeCreate(async function  (user,next) {
	user.password = await bcrypt.hash(user.password,10);


});

admin.prototype.checkPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// College.hasMany(user);
// user.belongsTo(College);

module.exports = admin;