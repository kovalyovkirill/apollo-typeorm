interface LoginPayload {
  email: string;
  password: string;
}

const resolvers = {
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
