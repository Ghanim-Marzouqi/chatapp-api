// Import Modules
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/Sequelize");
const { User } = require("./User");

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

// Create One-To-Many Relationship (Each Message Has One User)
Message.belongsTo(User);

// Sync Database
sequelize
  .sync()
  .then(() => {
    console.log("Messages Table Created!");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports.Message = Message;
