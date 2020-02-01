import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Repository } from 'typeorm';
import { User } from './entities/user';

import { getRepository } from 'typeorm';

import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UserAPI extends DataSource {
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  context: DataSourceConfig<any>;

  userRepository: Repository<User>;

  constructor() {
    super();

    this.userRepository = getRepository(User)
  }

  initialize(config) {
    this.context = config.context;
  }

  login({ email, password }: { email?: string, password?: string }) {
    console.log(email, password)//eslint-disable-line
    return { email, password };
  }

  async createUser({ email, password }: { email?: string, password?: string }) {
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(hashPassword)//eslint-disable-line

    const user = this.userRepository.create({
      email: email,
      password: hashPassword,
    });
    console.log(user)//eslint-disable-line
    try {
      const savedUser = await this.userRepository.save(user);
      console.log(savedUser, 'saved user')//eslint-disable-line
      return { ...savedUser };
    } catch (e) {
      console.log(e)//eslint-disable-line
      return null
    }
  }
}
