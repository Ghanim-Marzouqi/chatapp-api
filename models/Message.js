// Import Modules
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/Sequelize");

// Create Message Schema
const Message = sequelize.define("messages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
});

// Sync Database
sequelize
  .sync()
  .then(() => {
    console.log("Messages Table Created!");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports.Message = Message;
