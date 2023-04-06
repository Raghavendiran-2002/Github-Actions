const { DataTypes } = require("sequelize");
const sequelize = require("../services/database");
const Event = require("./event_model");
const User = require('./user');

const team = sequelize.define(
  "teamRegister",
  {
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Event.hasMany(team);
team.belongsTo(Event);

module.exports = team;
