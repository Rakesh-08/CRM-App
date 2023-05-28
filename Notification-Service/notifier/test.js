const emailTransporter = require("./emailService");

let emailObject = {
    from: "misoft34@gmail.com",
    to: "Mandal8285980523@gmail.com",
    subject: "nodemailer testing",
    text:"testing the notification service through nodemailer"
}


emailTransporter.sendMail(emailObject, async (err,info) => {
    
    if (err) {
        console.log(err.message)
    }else{
        console.log(info)
    }
})




