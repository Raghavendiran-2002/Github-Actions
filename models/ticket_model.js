const { DataTypes } = require("sequelize");
const sequelize = require("../services/database");
const Event = require("./event_model");
const User = require("./user");

const ticket = sequelize.define(
  "ticket",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ticket_type: {
      type: DataTypes.INTEGER,
      isIn: [[0, 1, 2]],
      // allowNull: false

      //  0 participant
      // 1 spectator
      // 2 ticketed event ticket
    },
    block: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      values: ["booked", "available", "blocked", "refund"],
      defaultValue: "available",
    },
    exp: {
      type: DataTypes.DATE,
    },
    team_emails: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  },
  { timestamps: true }
);
// two associations

// event and ticket
Event.hasMany(ticket);
ticket.belongsTo(Event);

// user and ticket
User.hasMany(ticket);
ticket.belongsTo(User);

module.exports = ticket;
