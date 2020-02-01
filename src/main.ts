import { ApolloServer } from 'apollo-server';

import 'reflect-metadata';

require('dotenv').config();

import typeDefs from './schema';
import resolvers from './resolvers';

import { UserAPI } from './datasources/user';

import { dbInit } from './utils';

dbInit();

export const dataSources = () => ({
  userAPI: new UserAPI(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
