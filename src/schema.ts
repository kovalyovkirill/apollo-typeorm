// The GraphQL schema
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    profile: String
  }

  type DefautResponse {
    ok: Boolean
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
    logout(refreshToken: String): DefautResponse
    createUser(email: String, password: String): DBUser
    renewToken(refreshToken: String) : RefreshTokenResponse
  }
`;

export default typeDefs;
