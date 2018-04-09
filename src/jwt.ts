import * as jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'Jalsdk#O@3o2849ahsDFAO3rrb'

interface JwtPayload {
  id: number
}

export const sign = (data: JwtPayload): string => {
  return jwt.sign(data, secret, {expiresIn: '3h'})
}

export const verify = (token: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload
}