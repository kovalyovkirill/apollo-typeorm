import { AuthenticationError } from 'apollo-server';

interface LoginPayload {
  email: string;
  password: string;
}

const resolvers = {
  Query: {
    profile: async (_, __, { dataSources, user }) => {
      if (!user) throw new AuthenticationError('UNAUTHORIZED');
      return await dataSources.userAPI.getProfile(user.id);
    },
  },
  Mutation: {
    login: async (_, { email, password }: LoginPayload, { dataSources }) => {
      return await dataSources.userAPI.login({ email, password });
    },
    createUser: async (_, { email, password }: LoginPayload, { dataSources }) => {
      return await dataSources.userAPI.createUser({ email, password });
    },
  }
};

export default resolvers;
