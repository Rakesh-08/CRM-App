let Client = require("node-rest-client").Client
let client = new Client();
let emails = "mandal8285980523@gmail.com";
let subject = "Sign up notification ";
let content = `Hey admin, a new user is signed up with your  ${process.env.APP} application. please have a look over the guy and try to communicate with him.


Regards
Rakesh_Mandal
Software Developer`


let sendEmailApi = "http://localhost:9999/notificationService/api/v1/sendEmail";

module.exports = () => {


    let data = {
        emails, subject, content
    }
    let args = {
        data: data,
        headers: { "Content-Type": "application/json" }
    }

 

    client.post(sendEmailApi, args, (err, data) => {
        if (err) {
            console.log(err);
            
        } 
    })

    
}

