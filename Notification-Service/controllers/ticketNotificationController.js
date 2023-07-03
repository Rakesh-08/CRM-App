
const ticketNotificationModel = require("../models/ticketNotificationsModel");



const acceptNotificationRequest = async (req, res) => {


    const notificationObject = {
        ticketId: req.body.ticketId,
        subject: req.body.subject,
        content: req.body.content,
        recepientEmails: req.body.recepientEmails,
        requester: req.body.requester
    }

    console.log(notificationObject)

    try {
        const notification = await ticketNotificationModel.create(notificationObject);

        if (notification) {
            res.status(201).send({
                requestId: notification._id,
                messsage: "Request has been accepted.Check status later by using the above given requestId "
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }

}


const getNotification = async (req, res) => {

    try {
        let notification = await ticketNotificationModel.findOne({
            _id: req.params.id
        })
      

        if (notification) {
            res.status(200).send(notification);
        } else {
            res.status(400).send({
                message: "there is no notification exist with this given id"
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
}

module.exports = {
    acceptNotificationRequest,
    getNotification
}











