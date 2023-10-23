import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  name: string;
  email: string;
}

export interface UserRequest extends Request {
  user?: JwtPayload;
}
