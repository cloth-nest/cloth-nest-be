import { Request } from 'express';
import { User } from 'src/entities';

export interface JwtPayload {
  userId: number;
  name: string;
  email: string;
}

export interface UserRequest extends Request {
  user?: AuthUser;
}

export interface AuthUser extends Partial<User> {
  permissions: string[];
}
