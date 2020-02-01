// The GraphQL schema
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    profile: String
  }

  type LoginResponse {
    id: ID,
    token: String
  }

  type User {
    id: Int,
    email: String,
    password: String,
  }

  type Mutation {
    login(email: String, password: String): LoginResponse
    createUser(email: String, password: String): User
  }
`;

export default typeDefs;
