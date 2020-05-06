// Import Modules
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/Sequelize");
const { User } = require("./User");
const { Message } = require("./Message");

// Create Message Schema
const Conversation = sequelize.define("conversations", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  messageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Message,
      key: "id",
    },
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Sync Database
sequelize
  .sync()
  .then(() => {
    console.log("Conversation Table Created!");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports.Conversation = Conversation;
