const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const db = require("./config/connection");
// replaces routes...
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // Creating the Apollo server and passing in schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  // Starting the server
  await server.start();
  // Integrating the server with the Express app
  server.applyMiddleware({ app });
  // Logging where it can be tested
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initializing the Apollo server
startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
// This and the above are for production only - Not development
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => console.log(`Now listening on localhost:${PORT}`));
});