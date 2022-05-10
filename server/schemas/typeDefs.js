const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  input BookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    users: [User]
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(email: String!, password: String!, username: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
