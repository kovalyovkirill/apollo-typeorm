import { ApolloServer } from 'apollo-server';

import 'reflect-metadata';

require('dotenv').config();

import typeDefs from './schema';
import resolvers from './resolvers';

import { UserAPI } from './datasources/user';

import { dbInit, verifyToken } from './utils';

dbInit();

export const dataSources = () => ({
  userAPI: new UserAPI(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: ({ req }) => {
    // Note! This example uses the `req` object to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they will vary for Express, Koa, Lambda, etc.!
    //
    // To find out the correct arguments for a specific integration,
    // see the `context` option in the API reference for `apollo-server`:
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server/

    // Get the user token from the headers.
    const token = req.headers.authorization || '';

    // try to retrieve a user with the token
    try {
      const user = verifyToken(token);
      // add the user to the context
      return { user };
    } catch (error) {
      return { user: null };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
