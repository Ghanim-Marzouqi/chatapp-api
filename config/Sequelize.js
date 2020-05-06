// Import Modules
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Load Environment Vraibales From (.env) File
dotenv.config();

// Create MySQL Connection
const conn = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: "mysql",
};

// Create Sequelize Instance
const sequelize = new Sequelize(conn.database, conn.user, conn.password, {
  host: conn.host,
  dialect: conn.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  operatorsAliases: false,
});

// Check MySQL Connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports.sequelize = sequelize;
