let Client = require("node-rest-client").Client;

let client = new Client();

module.exports = (ticketId, subject, content, emailIds, requester) => {
    let reqBody = {
        ticketId: ticketId,
        subject: subject,
        content: content,
        recepientEmails: emailIds,
        requester:requester
    }

    let args = {
        data: reqBody,
        headers:{"Content-Type":"application/json"}
    }
    let baseUrl= process.env.MONGODB_URI ? "https://notification-service-m4gi.onrender.com":"http://localhost:8080"
    
    
    client.post(`${baseUrl}/notificationService/api/v1/notification`, args, (data,response) => {
        
        console.log(data)
        console.log(response)
    })

 
//     client.post("https://notification-service-m4gi.onrender.com/notificationService/api/v1/notification", args, (data,response) => {
        
//         console.log(data)
//     })


}


