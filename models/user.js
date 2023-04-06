const { DataTypes } = require("sequelize");
const sequelize = require("../services/database");
const College = require("./college");

const user = sequelize.define(
  "user",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      values: ["male", "female", "others"],
      // 0 for male
      //  1 for female
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_accomodation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // role : {
    // 	type : DataTypes.STRING,
    // 	values : ['user','superadmin','clubadmin'],
    // 	defaultValue : 'user'
    // },
    person_type: {
      type: DataTypes.INTEGER,
      values: [0, 1, 2],
      // 0 Sastra
      // 1 other college particpent
      // 2 spectator
    },
    user_type: {
      type: DataTypes.BOOLEAN,
      // 0 sole
      // 1 team
    },
    registered_team_events: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    profile_url: {
      type: DataTypes.TEXT,
    },
    is_registered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // participantId : {
    //   type : DataTypes.INTEGER,
    //   unique : true
    // }
  },
  { timestamps: true }
);

College.hasMany(user);
user.belongsTo(College);

module.exports = user;
