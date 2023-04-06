const { database } = require("../config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  database.dbName,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: "postgres",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connection established");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

sequelize
  .sync()
  .then(() => {
    console.log("Tables created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = sequelize;
