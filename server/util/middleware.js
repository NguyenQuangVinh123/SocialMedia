const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
module.exports.checkEmptyRegister = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "User name not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (password === "") {
    errors.password = "Password not empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password must be match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "User name not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRETKEY);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");

};
