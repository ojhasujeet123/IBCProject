const nodemailer = require('nodemailer');
require('dotenv').config();

function sendEmail(email, otp, type) {
  try {
    if (!email || !otp || !type) {
      throw new Error("Email, otp, and type are required for sending an email");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTHEMAIL,
        pass: process.env.EMAILPASS,
      },
    });

    // Based on type send mail

    let subject, emailHTML;
    if (type === 'forgot-password') {
      subject = "Password Reset ";
      emailHTML = generateForgotPasswordHTML(otp);
    } else if (type === 'accountVerification') {
      subject = "Verify your account ";
      emailHTML = generateVerificationHTML(otp);
    } else {
      throw new Error("Invalid email type");
    }

    //Send Mail 

    transporter.sendMail({
      from: '"Sujeet Ojha" <sujeetjstech@gmail.com>',
      to: email,
      subject: subject,
      html: emailHTML,
    }).then(info => {
      console.log("Email sent");
    }).catch(console.error);

  } catch (error) {
    console.error(error);
    throw new Error("Error sending email");
  }
}



//Reset password HTML format

function generateForgotPasswordHTML(otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password OTP</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2>Forgot Password OTP</h2>
            <p>
                Hello,<br>
                We received a request to reset your password. Please use the following One Time Password (OTP) to complete the process:
            </p>
            <p style="background-color: #f2f2f2; padding: 10px; font-size: 1.2em; border-radius: 5px; text-align:center">
                <strong>${otp}</strong>
            </p>
            <p>
                This OTP is valid for a short period, so please use it promptly to reset your password.
            </p>
            <p>
                If you did not request a password reset, please ignore this email.
            </p>
            <p>
                Regards,<br>
                <i>Sujeet Kumar Ojha</i>
            </p>
        </div>
    </body>
    </html>
  `;
}

//Account verification HTML Template

function generateVerificationHTML(otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2>Email Verification</h2>
            <p>
                Hello,<br>
                Thank you for registering. To complete your registration, please use the following verification otp:
            </p>
            <p style="background-color: #f2f2f2; padding: 10px; font-size: 1.2em; border-radius: 5px; text-align:center">
                <strong>${otp}</strong>
            </p>
            <p>
                This otp will expire after a certain period, so make sure to use it promptly.
            </p>
            <p>
                If you did not sign up for this service, please disregard this email.
            </p>
            <p>
                Regards,<br>
                <i>Sujeet Kumar Ojha</i>
            </p>
        </div>
    </body>
    </html>
  `;
}

module.exports = { sendEmail };
