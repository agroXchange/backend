import * as sgMail from '@sendgrid/mail'
import {sendGridKey} from "../mailApiKey";

sgMail.setApiKey(sendGridKey)

const sender = 'agroxchange@example.com'

export const sendSignUpMail = (email: string, orgName: string) => {
  const msg = {
    to: email,
    from: sender,
    subject: 'Thank you for signing up for agroXchange',
    text: `Hello,\n
             \n
             Thank you for signing up to agroXchange as ${orgName}.\n
             Your account is currently pending and awaiting approval.\n
             \n
             When you're account is approved you will be notified again.`,
    html: `Hello,
             
             Thank you for signing up to agroXchange as ${orgName}.\n
             Your account is currently pending and awaiting approval.\n
             \n
             When you're account is approved you will be notified again.`
  }

  return sgMail.send(msg)
}

export const sendResetPasswordLink = (email: string, token: string) => {
  const baseUrl = 'http://localhost:3000/reset-password?token='
  const msg = {
    to: email,
    from: sender,
    subject: 'Password reset link for agroXchange.',
    text: `Hello,\n
             \n
             Here is a link for your password reset ${baseUrl + token}`,
    html: `Hello,
             
             Here is a link for your password reset <a href="${baseUrl + token}">${baseUrl + token}</a>`
  }
  return sgMail.send(msg)
}