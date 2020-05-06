// Import Needed Modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { validate, ValidationError } = require("express-validation");
const {
  createUserValidation,
  loginValidation,
  createMessageValidation,
} = require("./config/RequestValidation");
const { User } = require("./models/User");
const { Message } = require("./models/Message");

// Load Environment Vraibales From (.env) File
dotenv.config();

// Create Express Server
const app = express();

// Set Express Server Port
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// Use Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* **** Endpoints **** */
// Default Route
app.get("/", (req, res) => res.send("Welcome To Chat App API"));

// Create User Route
app.post("/users", validate(createUserValidation, {}, {}), async (req, res) => {
  try {
    // Get Parameters From Request Body
    const { name, email, phone, username } = req.body;

    // Create User In Database
    let user = await User.create({
      name,
      email,
      phone,
      username,
    });

    // Return Create User Response
    res.status(201).json({
      message: `New user: ${user.username} has created!`,
    });
  } catch (error) {
    console.log("{/users} ERROR", error);
    res.status(500).json({
      message: error,
    });
  }
});

// Login Route
app.post("/auth", validate(loginValidation, {}, {}), async (req, res) => {
  try {
    // Get Parameters From Request Body
    const { username } = req.body;

    // Find User Using Username
    let user = await User.findOne({ where: { username } });

    // Check If User Exists
    if (user !== null) {
      res.status(200).json({
        message: "User Logged In Successfully",
        user,
      });
    } else {
      res.status(404).json({
        message: "User Does Not Exist",
        user,
      });
    }
  } catch (error) {
    console.log("{/auth} ERROR", error);
    res.status(500).json({
      message: error,
    });
  }
});

// Create Message Route
app.post(
  "/messages",
  validate(createMessageValidation, {}, {}),
  async (req, res) => {
    try {
      // Get Parameters From Request Body
      const { message, userId } = req.body;

      // Create New Message
      let msg = await Message.create({ message, userId });

      // Return Create User Response
      res.status(201).json({
        message: msg,
      });
    } catch (error) {
      console.log(`{"/messages"} ERROR`, error);
      res.status(500).json({
        message: error,
      });
    }
  }
);

// Error Middleware
app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error);
  }
  return res.status(500).json(error);
});

// Run Server With Specified Port
app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
