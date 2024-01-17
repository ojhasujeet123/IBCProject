const nodemailer=require('nodemailer')
require('dotenv').config()


  function sendEmail(email,text,verifytoken){

    try {
        if(!email || !verifytoken){
          throw new Error("Email and otp are  required for sendimg an email")
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth: {
              user: "sujeetjstech@gmail.com",
              pass: "amhd bshu qbpr zzeq "
            },
          });
          
          
          transporter.sendMail({
            from: '"Sujeet Ojha" <sujeetjstech@gmail.com>', 
            to: email, 
            subject: "Verification Token ✔",
            text: `verification token for ${text} is: ${verifytoken}`, 
            
          }).then(info => {
            console.log({info});
          }).catch(console.error);


    } catch (error) {
        console.error(error)
        throw new Error("Error sending email");
    }
}


module.exports={sendEmail};