
const nodemailer = require("nodemailer");

// create a transport object

module.exports = nodemailer.createTransport({
    
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: "misoft34@gmail.com",
        pass:"lanowhydjhwksjzt"
    },
    secure:true


});








