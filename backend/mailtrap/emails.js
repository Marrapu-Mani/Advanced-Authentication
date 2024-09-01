import { client, sender } from './mailtrap.js';
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipients = [{ email }];

  try {
      const response = await client
        .send({
          from: sender,
          to: recipients,
          subject: "Verify your email",
          html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
          category: "Email Verification",
        })
        
      console.log("Verification email sent successfully", response);
  } catch (error) {
      console.error('Error sending verification email: ', error);
      throw new Error(`Error sending verification email: ${error}`);
  }
}

export const sendWelcomeEmail = async (email, username) => {
  const recipients = [{ email }];

  try {
      const response = await client
        .send({
          from: sender,
          to: recipients,
          template_uuid: "f488bf8d-7186-40b6-b2aa-4e83ac9290a8",
          template_variables: {
              "company_info_name": "Advanced Auth Company",
              "name": username,
              "company_info_address": "Software City",
              "company_info_city": "Bengaluru",
              "company_info_country": "India"
          }
        });
        
      console.log("Welcome email sent successfully", response);
  } catch (error) {
      console.error('Error sending welcome email: ', error);
      throw new Error(`Error sending welcome email: ${error}`);
  }
}

export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipients = [{ email }];
 
  try {
    const response = await client
      .send({
        from: sender,
        to: recipients,
        subject: "Reset your Password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        category: "Password Reset",
      })
      
    console.log("Password reset email sent successfully", response);
  } catch (error) {
      console.error('Error sending password reset email: ', error);
      throw new Error(`Error sending password reset email: ${error}`);
  }
}

export const sendResetSuccessfulEmail = async (email) => {
  const recipients = [{ email }];

  try {
    const response = await client
      .send({
        from: sender,
        to: recipients,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category: "Password Reset",
      })
      
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
      console.error('Error sending password reset success email: ', error);
      throw new Error(`Error sending password reset success email: ${error}`);
  }
}
