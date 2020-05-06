// Import Modules
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/Sequelize");

// Create User Schema
const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    is: /^[79]\d{7}$/i,
    validate: {
      isNumeric: true,
      notEmpty: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Users Table Created!");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports.User = User;
