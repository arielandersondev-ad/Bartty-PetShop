import jwt, { SignOptions } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET!

export function signToken(payload: object, expiresIn = 3600): string {
  const options: SignOptions = { expiresIn }
  return jwt.sign(payload, SECRET_KEY, options)
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch {
    return null
  }
}
