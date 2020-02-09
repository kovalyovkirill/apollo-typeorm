import { UserAPI } from '../datasources/user';

export const refreshTokens = async (tokenValue: string) => {
  const userApi = new UserAPI();
  try {
    const { refreshToken, token } = await userApi.renewToken(tokenValue);
    return { refreshToken, token }
  } catch (error) {
    return { token: null, refreshToken: null }
  }
};
