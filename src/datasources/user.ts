import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Repository } from 'typeorm';
import { User } from './entities/user';
import { RefreshToken } from './entities/refreshToken';
import { UserInputError, ApolloError } from 'apollo-server';

import { getRepository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid/v4';
import { generateToken } from '../utils';

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_EXPIRED = 30 * 24 * 60 * 60 * 1000;

interface AuthPayload { email?: string, password?: string }

export class UserAPI extends DataSource {
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  context: DataSourceConfig<any>;

  userRepository: Repository<User>;

  refreshTokenRepository: Repository<RefreshToken>;

  constructor() {
    super();

    this.userRepository = getRepository(User);
    this.refreshTokenRepository = getRepository(RefreshToken);
  }

  initialize(config) {
    this.context = config.context;
  }

  async login({ email, password }: AuthPayload) {
    // TODO: add validation of email and password
    try {
      const user = await this.userRepository.findOne({ email });

      if (!user) return new UserInputError('USER_NOT_FOUND');

      const match = await bcrypt.compare(password, user.password);

      if (!match) return new UserInputError('WRONG_PASSWORD');

      const token = generateToken(user.id, user.email);
      const refreshToken = uuid();

      const expired = new Date(Date.now() + REFRESH_TOKEN_EXPIRED);

      const refreshTokenData = this.refreshTokenRepository.create({
        expired,
        tokenValue: refreshToken,
        user: user,
      });

      await this.refreshTokenRepository.save(refreshTokenData);

      return { id: user.id, token, refreshToken };
    } catch (error) {
      throw new ApolloError('INTERNAL_ERROR', '500', { error: error.message });
    }
  }

  async createUser({ email, password }: AuthPayload): Promise<User | Error> {
    try {
      const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = this.userRepository.create({
        email: email,
        password: hashPassword,
      });

      return  await this.userRepository.save(user);
    } catch (error) {
      const isDuplicate = error.message.includes('duplicate');

      if (isDuplicate) throw new UserInputError('EMAIL_ALREADY_EXISTS');

      throw new ApolloError('INTERNAL_ERROR', '500', { detail: error.message });
    }
  }

  async getProfile(id: string): Promise<string | Error> {
    try {
      const user = await this.userRepository.findOne(id);
      return user.email;
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }
}
