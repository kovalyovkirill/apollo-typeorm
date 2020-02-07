// The GraphQL schema
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    profile: String
  }

  type LoginResponse {
    id: ID,
    token: String,
    refreshToken: String
  }

  type RefreshTokenResponse {
    token: String,
    refreshToken: String,
  }

  type DBUser {
    id: Int,
    email: String,
  }

  type Mutation {
    login(email: String, password: String): LoginResponse
    createUser(email: String, password: String): DBUser
    renewToken(refreshToken: String) : RefreshTokenResponse
  }
`;

export default typeDefs;
