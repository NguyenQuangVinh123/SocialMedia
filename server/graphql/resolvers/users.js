const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { checkEmptyRegister, validLoginInput } = require("../../util/middleware");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRETKEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
    async login(_, { email, password }) {
      const { valid, errors } = validLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Erros", { errors });
      }
      const user = await User.findOne({ email });
      if (user === null) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "User not found";
          throw new UserInputError("User not found", { errors });
        }
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      const { valid, errors } = checkEmptyRegister(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Erros", { errors });
      }
      const isEmailUnique = await User.findOne({ email });
      const isUserNameUnique = await User.findOne({ username });

      if (isEmailUnique) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      } else if (isUserNameUnique) {
        throw new UserInputError("User Name is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      password = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
