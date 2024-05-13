const nodemailer = require('nodemailer');
require('dotenv').config();




function sendEmail(name,email, otp, type) {

    let subject, emailHTML;

      if (type === 'forgot-password') {
      subject = "Password Reset ";
      emailHTML = generateForgotPasswordHTML(name ,otp);
    } else if (type === 'accountVerification') {
      subject = "Verify your account ";
      emailHTML = generateVerificationHTML(name,otp);
    } else if(type === "password reset"){
          subject="Password Updated Successfully",
          emailHTML=generatePasswordReset(name)
    }
    else {
      throw new Error("Invalid email type");
    }
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'https://api.mailgun.net/v3/mail-go.site/messages',
    'headers': {
      'Authorization': process.env.MAILGUNAUTHENTICATION
    },
    formData: {
      'from': 'GLSCAN <info@mail-go.site>',
      'to': `Dear Member <${email}>`,
      'subject': subject,
      'html': emailHTML
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });




}

//Reset password HTML format

function generateForgotPasswordHTML(name,otp) {
  return `
   <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot password otp</title>
</head>

<body>
  <div style="text-align: center;max-width: 600px;margin: auto;">
    <div style="background-color: #2e2f2f;justify-content: center;height: 50px;">
      <img
        src="https://res.cloudinary.com/dp2jq1xi2/image/upload/v1715599272/exchange/glc_logo/h7qusqff6ofwebkaajpe.png"
        style="margin-top: 0px;
      width: 70px; "></img>
    </div>
  </div>
  <div style="text-align: left;max-width: 600px;margin: auto;padding-left: 10px;color: #2e2f2f;font-family: serif">
    <h2>Email Verification</h2>
    <p>
      Hello ${name},<br>
      <br>
      Thank you for registering. To complete your registration, please use the following verification otp:
    </p>
    <p>
      <strong style="color: rgb(10, 151, 34);">${otp}</strong>
    </p>
    <p>
      This otp will expire after a certain period, so make sure to use it promptly.
    </p>
    <p>
      If you did not sign up for this service, please disregard this email.
    </p>
    <p>
      Regards,<br>
      <i>Team Glscan</i>
    </p>

  </div>
</body>
</body>

</html>
  `;
}

//Account verification HTML Template

function generateVerificationHTML(name ,otp) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
  </head>
  
  <body>
    <div style="text-align: center;max-width: 600px;margin: auto;">
      <div style="background-color: #2e2f2f;justify-content: center;height: 50px;">
        <img
          src="https://res.cloudinary.com/dp2jq1xi2/image/upload/v1715599272/exchange/glc_logo/h7qusqff6ofwebkaajpe.png"
          style="margin-top: 0px;
        width: 70px; "></img>
      </div>
    </div>
    <div style="text-align: left;max-width: 600px;margin: auto;padding-left: 10px;color: #2e2f2f;font-family: serif">
      <h2>Email Verification</h2>
      <p>
        Hello ${name},<br>
        <br>
        Thank you for registering. To complete your registration, please use the following verification otp:
      </p>
      <p>
        <strong style="color: rgb(10, 151, 34);">${otp}</strong>
      </p>
      <p>
        This otp will expire after a certain period, so make sure to use it promptly.
      </p>
      <p>
        If you did not sign up for this service, please disregard this email.
      </p>
      <p>
        Regards,<br>
        <i>Team Glscan</i>
      </p>
  
    </div>
  </body>
  </body>
  
  </html>
  `;
}


// Password Reset Success HTML Template
function generatePasswordReset(name) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password reset successfully</title>
  </head>
  
  <body>
    <div style="text-align: center;max-width: 600px;margin: auto;">
      <div style="background-color: #2e2f2f;justify-content: center;height: 50px;">
        <img
          src="https://res.cloudinary.com/dp2jq1xi2/image/upload/v1715599272/exchange/glc_logo/h7qusqff6ofwebkaajpe.png"
          style="margin-top: 0px;
        width: 70px; "></img>
      </div>
    </div>
    <div style="text-align: left;max-width: 600px;margin: auto;padding-left: 10px;color: #2e2f2f;font-family: serif">
      <h2>Password reset successfully</h2>
      <p>
        Hello ${name},<br>
        <br>
                       Your password has been successfully reset. You can now use your new password to log in to your account.

      </p>
   
                If you did not perform this action, please contact our support team immediately.
      </p>
      
      <p>
        Regards,<br>
        <i>Team Glscan</i>
      </p>
  
    </div>
  </body>
  </body>
  
  </html>
  `;
}






















//forgot SUBMISSION EMAIL
function sendQuerySubmissionEmail(name, email, query) {
  
    if (!name || !email || !query) {
      throw new Error("Name, email, and query are required for sending a query submission email");
    }



    const subject = "Query Submission";
    const emailHTML = generateQuerySubmissionHTML(name, email, query);

    var request = require('request');
    var options = {
      'method': 'POST',
      'url': 'https://api.mailgun.net/v3/mail-go.site/messages',
      'headers': {
        'Authorization': process.env.MAILGUNAUTHENTICATION
      },
      formData: {
        'from': 'GLSCAN <info@mail-go.site>',
        'to': `Dear Member <${email}>`,
        'subject': subject,
        'html': emailHTML
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
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
    if (!email && !name && !text) {
      throw new Error("email, and text are required for sending a query submission email");
    }

  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'https://api.mailgun.net/v3/mail-go.site/messages',
    'headers': {
      'Authorization': process.env.MAILGUNAUTHENTICATION
    },
    formData: {
      'from': 'GLSCAN <info@mail-go.site>',
      'to': `Dear Member <${email}>`,
      'subject': "Forgot Password",
      'html': forgotEmail(name,newpasword)
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
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
      <div style="text-align: center;max-width: 600px;margin: auto;">
    <div style="background-color: #2e2f2f;justify-content: left;height: 50px;">
      <img
        src="https://res.cloudinary.com/dp2jq1xi2/image/upload/v1715599272/exchange/glc_logo/h7qusqff6ofwebkaajpe.png"
        style="margin-top: 0px;
      width: 70px; "></img>
    </div>
    <div style="text-align: left;max-width: 600px;margin: auto;padding-left: 10px;color: #2e2f2f;font-family: serif">
    <p>Dear ${name},</p>

    <p>We received a request to reset your password. To proceed with the password reset, please click on the following link:</p>

    <p> Auto Generated Password :${newpasword}</p>
    <a href="https://glscan.io/LoginPage">For further process click here </a>
    <p>If you didn't initiate this request, you can ignore this email. The link will expire after a certain period for security reasons.</p>

    <p>Feel free to contact us if you have any questions or concerns.</p>

       <p>
      Regards,<br>
      <i>Team Glscan</i>
    </p>
     </div>
  </body>
  </html>
  `;
}





module.exports = { sendEmail, sendQuerySubmissionEmail, sendForgotEmail};
