var { SendMailClient } = require("zeptomail");
const url = "api.zeptomail.in/";
const token = process.env.ZEPTO_TOKEN;
let client = new SendMailClient({url, token});

const sendZeptoMail = async ( to , subject , data ) => {
  
  let template = '<body style="background-color: #f4cac8;">'
  +'<div style="display: flex; align-items:center; justify-content: center; margin-top: 50px;">'
      +'<img src="'+process.env.BASE_URL+'dist/img/gtcscan.png" width="200px"/>'
  +'</div>'
  +'<div style="text-align: center;">'
      +'<h2 style="color: #353535;font-family: sans-serif;font-size: 20px;line-height: 24px;text-align: center;font-weight: bold;">Your Account is successfully activated!</h2>'
  +'<pre style="color: #606060;font-family: sans-serif;font-size: 16px;line-height: 22px;text-align: center;padding-bottom: 8px;">'
  +'Welcome to Gtcscan - the interface of GTC Blockchain! Thanks for joining us. You can '
  +'now log in and explorer the personalized features at '
  +'<a href="'+process.env.BASE_URL+'" style="text-decoration: none; color: #1990ff;">gtcscan.com</a>'
  +'</pre>'
  +'</div>'
  +'<div style="display: flex; justify-content: center;">'
  +'<a href="'+process.env.BASE_URL+'user/verify-account/?email='+to+'&verifytoken='+data.verifytoken+'" style="color: #fff; text-decoration: none; background-color: black; padding: 10px 14px;'
  +'font-size: 16px;line-height: 24px;padding: 16px 20px;text-align: center;font-weight: bold;border-radius: 8px;min-width: 264px; ">Log in now</a>'
  +'</div>'
  +'<div style="display: flex; justify-content: center; margin-top: 50px;">'
  +'<p>join us:</p>'
  +'<p><a href="'+process.env.BASE_URL+'" style="text-decoration: none; color: #1990ff; border-right: 1px solid black; padding-right: 20px; margin-left: 10px;">Discord</a></p>'
  +'<p><a href="'+process.env.BASE_URL+'" style="text-decoration: none; color: #1990ff; margin-left: 20px;">Twitter</a></p>'
  +'</div></div></body>';
    client.sendMail({
      "bounce_address": "info@support.gtcscan.com",
      "from": 
      {
          "address": "noreply@gtcscan.com",
          "name": "Gtcscan"
      },
      "to": 
      [
          {
          "email_address": 
              {
                  "address": to,
                  "name":'GTCSCAN'
              }
          }
      ],
      "subject": subject,
      "htmlbody": template,
    }).then((resp) => console.log("success",resp)).catch((error) => console.log("error",error,JSON.stringify(error)));
}  
module.exports ={sendZeptoMail }