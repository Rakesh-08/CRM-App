
const cron = require("node-cron");
const ticketNotificationModel = require("../models/ticketNotificationsModel");
const emailTransporter= require("../notifier/emailService")

cron.schedule("*/30 * * * * * ", async () => {


 // quer all the notifications that have status not sent
    
    let notifications = await ticketNotificationModel.find({
        status:"NOT_SENT"
    }).limit(10)

    // send emails to all those notifications using emailTransporter

    if (notifications.length > 0) {
        notifications?.map(n => {

            let emailObject = {
                from: "misoft34@gmail.com",
                to: n.recepientEmails,
                subject: n.subject,
                text: n.content
            }
       


            emailTransporter.sendMail(emailObject, async (err, info) => {

                if (err) {
                    console.log(err.message)
                } else {
                    console.log(info)

                    n.status = "SENT"
                    await n.save();
                }
            })


        
        })
    }
    
})







