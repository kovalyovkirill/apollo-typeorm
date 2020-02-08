import { AuthenticationError } from 'apollo-server';

interface LoginPayload {
  email: string;
  password: string;
}

interface LogoutPayload {
  refreshToken: string;
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
    logout: async (_, { refreshToken }: LogoutPayload, { dataSources }) => {
      return await dataSources.userAPI.logout(refreshToken);
    },
    createUser: async (_, { email, password }: LoginPayload, { dataSources }) => {
      return await dataSources.userAPI.createUser({ email, password });
    },
    renewToken: async (_, { refreshToken }, { dataSources }) => {
      return await dataSources.userAPI.renewToken(refreshToken);
    }
  }
};

export default resolvers;
