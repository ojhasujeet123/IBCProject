const nodemailer = require('nodemailer');
require('dotenv').config();


//AUTHENTICATION RELATED EMAIL MESSAGE FUNCTION
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
    } else if(type === "password reset"){
          subject="Password Updated Successfully",
          emailHTML=generatePasswordReset()
    }
    else {
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


// Password Reset Success HTML Template
function generatePasswordReset() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Success</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2>Password Reset Successful</h2>
            <p>
                Hello,<br>
                Your password has been successfully reset. You can now use your new password to log in to your account.
            </p>
            <p>
                If you did not perform this action, please contact our support team immediately.
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






















//forgot SUBMISSION EMAIL
function sendQuerySubmissionEmail(name, email, query) {
  try {
    if (!name || !email || !query) {
      throw new Error("Name, email, and query are required for sending a query submission email");
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

    const subject = "Query Submission";
    const emailHTML = generateQuerySubmissionHTML(name, email, query);

    transporter.sendMail({
      from: '"sujeet ojha" <sujeetjstech@gmail.com>',
      to: email,
      subject: subject,
      html: emailHTML,
    }).then(info => {
      console.log("Query submission email sent");
    }).catch(console.error);

  } catch (error) {
    console.error(error);
    throw new Error("Error sending query submission email");
  }
}

function generateQuerySubmissionHTML(name, email, query) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Query Submission</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2>Query Submission</h2>
            <p>
                Hello ${name},<br>
                Thank you for reaching out to us with your query. We have received the following information:
            </p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Query:</strong> ${query}</p>
            <p>
                We will get back to you as soon as possible with a response to your query. If you have any additional information to provide, please feel free to reply to this email.
            </p>
            <p>
                Thank you for your patience and understanding.
            </p>
            <p>
                Regards,<br>
                <i>Your Name or Company Name</i>
            </p>
        </div>
    </body>
    </html>
  `;
}


function sendForgotEmail(email,name,newpasword) {
  try {
    if (!email && !name && !text) {
      throw new Error("email, and text are required for sending a query submission email");
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

    const subject = "Forgot password Link";
    const emailHTML = forgotEmail(name,newpasword);

    transporter.sendMail({
      from: '"sujeet ojha" <sujeetjstech@gmail.com>',
      to: email,
      subject: subject,
      html: emailHTML,
    }).then(info => {
      console.log("forgot link sent on  email successfully");
    }).catch(console.error);

  } catch (error) {
    console.error(error);
    throw new Error("Error sending query submission email");
  }
}


function forgotEmail(name,newpasword) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forgot Email</title>
    </head>
    <body>
      <p>Dear ${name},</p>

      <p>We received a request to reset your password. To proceed with the password reset, please click on the following link:</p>

      <p> ${newpasword}</p>
      <p>If you didn't initiate this request, you can ignore this email. The link will expire after a certain period for security reasons.</p>

      <p>Feel free to contact us if you have any questions or concerns.</p>

      <p>Best regards,<br>
      sujeet ojha<br>
    </body>
    </html>
  `;
}





module.exports = { sendEmail, sendQuerySubmissionEmail, sendForgotEmail};
