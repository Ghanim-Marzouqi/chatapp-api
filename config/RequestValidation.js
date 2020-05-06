// Import Modules
const { Joi } = require("express-validation");

// Create User Validation
module.exports.createUserValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .regex(/^[79]\d{7}$/)
      .required(),
    username: Joi.string().required(),
  }),
};

// Login Validation
module.exports.loginValidation = {
  body: Joi.object({
    username: Joi.string().required(),
  }),
};

// Create Conversation Validation
module.exports.createConversationValidation = {
  body: Joi.object({
    message: Joi.string().required(),
    senderId: Joi.number().required(),
    receiverId: Joi.number().required(),
  }),
};

// Create Conversation Validation
module.exports.getConversationValidation = {
  body: Joi.object({
    senderId: Joi.number().required(),
    receiverId: Joi.number().required(),
  }),
};
