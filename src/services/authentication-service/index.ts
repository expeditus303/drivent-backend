import sessionRepository from '@/repositories/session-repository';
import userRepository from '@/repositories/user-repository';
import { exclude } from '@/utils/prisma-utils';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from './errors';
import axios from 'axios';
import { stringify } from 'querystring';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function signInWithGithub(code: string) {
  const { CLIENT_ID, CLIENT_SECRET } = process.env;

  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
  };

  const queryString = stringify(params);

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token?' + queryString,
      {},
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const { access_token } = response.data;

    const userInfoResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    if (userInfoResponse.data) {
      const { id } = userInfoResponse.data;
      const githubId = id.toString();
      const userExists = await userRepository.findByGithubId(githubId);

      if (!userExists) {
        const { email } = userInfoResponse.data;
        const user = await userRepository.createGithubUser(email, githubId);

        const token = await createSession(user.id);

        return {
          user: exclude(user, 'password', 'githubId'),
          token,
        };
      }

      const token = await createSession(userExists.id);

      return {
        user: exclude(userExists, 'password', 'githubId'),
        token,
      };
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

const authenticationService = {
  signIn,
  signInWithGithub,
};

export default authenticationService;
export * from './errors';
