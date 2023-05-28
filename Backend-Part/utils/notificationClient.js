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
 
    client.post("http://localhost:9999/notificationService/api/v1/notification", args, (data,response) => {
        
        console.log(data)
    })


}


