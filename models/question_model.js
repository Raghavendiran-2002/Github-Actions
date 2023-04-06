const { DataTypes } = require("sequelize");
const sequelize = require("../services/database");
const Event = require("./event_model");

const question = sequelize.define(
  "question",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    question: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
  },
  { timestamps: false }
);

Event.hasMany(question);
question.belongsTo(Event);

module.exports = question;
