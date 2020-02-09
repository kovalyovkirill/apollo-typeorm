import { ApolloServer } from 'apollo-server';

import 'reflect-metadata';

require('dotenv').config();

import typeDefs from './schema';
import resolvers from './resolvers';

import { UserAPI } from './datasources/user';

import { dbInit, verifyToken } from './utils';
import { refreshTokens } from './utils/refreshTokens';

dbInit();

export const dataSources = () => ({
  userAPI: new UserAPI(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: async ({ req, res }) => {
    // Note! This example uses the `req` object to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they will vary for Express, Koa, Lambda, etc.!
    //
    // To find out the correct arguments for a specific integration,
    // see the `context` option in the API reference for `apollo-server`:
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server/

    // Get the user token from the headers.
    const requestToken = req.headers.authorization || '';

    const userData = { user: null };

    // try to retrieve a user with the token
    if (requestToken) {
      try {
        userData.user = verifyToken(requestToken);
      } catch (error) {
        console.log(error.message)//eslint-disable-line
        const tokenValue = req.headers['x-refresh-token'];
        console.log(tokenValue)//eslint-disable-line
        const { token, refreshToken } = await refreshTokens(tokenValue as string);

        if (!token || !refreshToken) {
          return userData
        }

        res.set('x-token', token);
        res.set('x-refresh-token', refreshToken);
        userData.user = verifyToken(token);

        return userData;
      }
    }
    return userData
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
