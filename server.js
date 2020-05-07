// Import Needed Modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { validate, ValidationError } = require("express-validation");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("./config/Sequelize");
const {
  createUserValidation,
  loginValidation,
  createConversationValidation,
  getConversationValidation,
} = require("./config/RequestValidation");
const { User } = require("./models/User");
const { Message } = require("./models/Message");
const { Conversation } = require("./models/Conversation");

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
    res.json({
      statusCode: 201,
      message: `New User (${user.name}) Created!`,
    });
  } catch (error) {
    console.log("{/users} ERROR", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.json({
        statusCode: 500,
        message: "User Already Exists",
      });
    } else {
      res.json({
        statusCode: 500,
        message: error,
      });
    }
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
      res.json({
        statusCode: 200,
        message: "User Logged In Successfully",
        user,
      });
    } else {
      res.json({
        statusCode: 404,
        message: "User Does Not Exist",
        user,
      });
    }
  } catch (error) {
    console.log("{/auth} ERROR", error);
    res.json({
      statusCode: 500,
      message: error,
    });
  }
});

// Create Conversation Route
app.post(
  "/conversations/create",
  validate(createConversationValidation, {}, {}),
  async (req, res) => {
    try {
      // Get Parameters From Request Body
      const { message, senderId, receiverId } = req.body;

      // Get Sender And Receiver
      let sender = await User.findOne({ where: { id: senderId } });
      let receiver = await User.findOne({ where: { id: receiverId } });

      if (sender !== null && receiver !== null) {
        // Create New Message
        let msg = await Message.create({ message });

        // Create New Conversation
        let conversation = await Conversation.create({
          messageId: msg.id,
          senderId,
          receiverId,
        });

        if (conversation.id) {
          // Return Create User Response
          res.json({
            statusCode: 201,
            message: "Message Chat Created",
            data: {
              messageText: msg.message,
              sender: sender.name,
              receiver: receiver.name,
            },
          });
        } else {
          // Return Create User Response
          res.json({
            statusCode: 404,
            message: "Cannot Create Conversation",
          });
        }
      } else {
        if (sender === null) {
          res.json({
            statusCode: 404,
            message: "Sender User Does Not Exist",
          });
        } else if (receiver === null) {
          res.json({
            statusCode: 404,
            message: "Receiver User Does Not Exist",
          });
        }
      }
    } catch (error) {
      console.log(`{"/conversations/create"} ERROR`, error);
      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }
);

// Get Conversations Route
app.post(
  "/conversations",
  validate(getConversationValidation, {}, {}),
  async (req, res) => {
    try {
      // Get Sender Id
      const { senderId, receiverId } = req.body;

      // Get Sender And Receiver
      let sender = await User.findOne({ where: { id: senderId } });
      let receiver = await User.findOne({ where: { id: receiverId } });

      if (sender !== null && receiver !== null) {
        // Fetch Sender Records
        let records = await sequelize.query(
          "SELECT m.* FROM messages m, conversations c WHERE m.id = c.messageId AND c.senderId = ? AND c.receiverId = ?",
          {
            replacements: [senderId, receiverId],
            type: QueryTypes.SELECT,
          }
        );

        res.status(200).json({
          message: "Conversations loaded successfully",
          conversations: records,
        });
      } else {
        if (sender === null) {
          res.json({
            statusCode: 404,
            message: "Sender User Does Not Exist",
          });
        } else if (receiver === null) {
          res.json({
            statusCode: 404,
            message: "Receiver User Does Not Exist",
          });
        }
      }
    } catch (error) {
      console.log(`{"/conversations"} ERROR`, error);
      res.json({
        statusCode: 500,
        message: error,
      });
    }
  }
);

// Error Middleware
app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    console.log("ValidationError", error);
    return res.json({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
  return res.json({
    statusCode: 500,
    message: error,
  });
});

// Run Server With Specified Port
app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
