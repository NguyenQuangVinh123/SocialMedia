const postsResolver = require("./posts");
const userResolver = require("./users");
module.exports = {
  Query: {
    ...postsResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postsResolver.Mutation
  },
};
