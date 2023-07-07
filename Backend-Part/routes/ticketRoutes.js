const { authJwtValidators, ticketValidators } = require('../middlewares/index')
const ticketController = require("../controllers/ticketController")


module.exports = function (app) {

    app.post("/crm/api/v1/tickets", [authJwtValidators.verifyToken, ticketValidators.validateTicketBody], ticketController.createTicket)
    app.put("/crm/api/v1/tickets/:_id", [authJwtValidators.verifyToken, ticketValidators.validateTicketStatus], ticketController.updateTicket)
    app.get("/crm/api/v1/tickets", [authJwtValidators.verifyToken], ticketController.getAllTickets)
    app.get("/crm/api/v1/tickets/:_id", [authJwtValidators.verifyToken], ticketController.getTicketById);
    app.delete("/crm/api/v1/tickets/:_id",[authJwtValidators.verifyToken],ticketController.deleteTicket);
    app.put("/crm/api/v1/assignTickets", [authJwtValidators.verifyToken,ticketValidators.validateTicketAssignment], ticketController.assignTicketToEngineer);
    app.get("/crm/api/v1/getEmail",[authJwtValidators.verifyToken],ticketController.getEmail)


}









