import * as jwt from 'jsonwebtoken';

export function generateToken(id: number, email: string): string {
  return jwt.sign({
    email,
    id,
  }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(bearerToken: string): { email: string, id: string } | Error {
  const token = bearerToken.replace('Bearer ', '');
  return jwt.verify(token, process.env.JWT_SECRET);
}
