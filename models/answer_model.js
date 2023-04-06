const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');
const User = require('./user');
const Event = require('./event_model');
const Question = require('./question_model');

const answer = sequelize.define("answer", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue : DataTypes.UUIDV4
    },
    answer: {
        type: DataTypes.TEXT('medium'),
        allowNull: false
    }
}, {timestamps: false});

// two associations

// user and answer model
User.hasMany(answer);
answer.belongsTo(User);

// question and answer model
Question.hasMany(answer);
answer.belongsTo(Question);

Event.hasMany(answer);
answer.belongsTo(Event);

module.exports = answer;