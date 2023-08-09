import authenticationService, { SignInParams } from '@/services/authentication-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function signInWithGithub(req: Request, res: Response) {
  const { code } = req.query;

  if (typeof code !== 'string') {
    return res.status(httpStatus.BAD_REQUEST).send({ error: 'Invalid code parameter' });
  }

  try {
    const result = await authenticationService.signInWithGithub(code);
    return res.status(httpStatus.OK).send(result);
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
