const ticketNotifiController = require("../controllers/ticketNotificationController");

module.exports = (app) => {
    
    app.post("/notificationService/api/v1/notification",ticketNotifiController.acceptNotificationRequest)
    app.get("/notificationService/api/v1/notification/:id", ticketNotifiController.getNotification);
    app.post("/notificationService/api/v1/sendEmail",ticketNotifiController.sendEmail)

}











