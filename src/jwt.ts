import * as jwt from 'jsonwebtoken'

export const secret = process.env.JWT_SECRET || 'Jalsdk#O@3o2849ahsDFAO3rrb'

interface JwtPayload {
  id: number,
  role: string,
  profileId: number
}

export const sign = (data: JwtPayload): string => {
  return jwt.sign(data, secret, {expiresIn: '3000h'})
}

export const verify = (token: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload
}

export const signPasswordToken = (data: Partial<JwtPayload>, passwordSecret: string): string => {
  return jwt.sign(data, passwordSecret, {expiresIn: '1h'})
}

export const verifyPasswordToken = (token: string, passwordSecret: string): JwtPayload => {
  return jwt.verify(token, passwordSecret) as JwtPayload
}