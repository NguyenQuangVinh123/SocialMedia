const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
require("dotenv").config();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
mongoose
  .connect(process.env.DATABASEURL, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server runnung at ${res.url}`);
  });
