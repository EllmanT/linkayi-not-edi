const nodemailer = require("nodemailer");

const hbs = require("nodemailer-express-handlebars");

const sendMail = async(options)=>{
    const transporter = nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,

        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    })

    const mailOptions={
        from:{
            name:"Axis Solutions",
            address:process.env.SMPT_HOST,

        },
        
        to:[options.email,"tmuranda@axissol.com"],
        subject:options.subject,
        cc:"alleaworldwide@gmail.com",
        html:`
        
         
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h3>
  Dear ${options.companyName},
        
    </h3>
<p>Kindly close the day for production, for ${options.companyName}.
</p>
<p>Their device id is ${options.deviceId}.
</p>

<p>Best Regards, Axis Help Desk</p>

<p>Axis Help Desk</p>
    <img src="https://i.ibb.co/gbYtgDM/footer-image.png" alt="Footer Image" style="display: block; margin-top: 1rem;">

</body>
</html>
    `
    };
    await transporter.sendMail(mailOptions)
}

module.exports = sendMail;
