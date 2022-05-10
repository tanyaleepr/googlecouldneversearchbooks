const jwt = require("jsonwebtoken");
require("dotenv").config;

// set token secret and expiration date
// Couldn't get dotenv and the .env secret to work as intended
const secret = "secretshhh";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"] from header
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // If no token, return the request object as it is
    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      // Decode and attach user data to the request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    // Return updated request object
    return req;
  },
  // sign a token by assigning user data, secret, and expiration date
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};