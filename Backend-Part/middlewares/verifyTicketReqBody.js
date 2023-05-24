
const constants= require("../utils/constants")

const validateTicketBody = (req, res, next) => {
    
    // validate the titile of ticket

    if (!req.body.title) {
        return res.status(400).send({
            message:"title of ticket not provided"
        })
    }

    // validate the description of ticket

    if (!req.body.description) {
        return res.status(400).send({
            message:"Failed! description is not provided"
        })
    }

    next();

}

const validateTicketStatus = (req, res, next) => {
    
    const statusProvided = req.body.status;
    const availableStatus= [constants.ticketStatus.open,constants.ticketStatus.inProgress,constants.ticketStatus.blocked, constants.ticketStatus.closed]
 
    if (statusProvided && !availableStatus.includes(statusProvided)) {
        return res.status(400).send({
            message:"Failed! status provided is invalid"
        })
    }

    next();
}

module.exports = {
    validateTicketBody,
    validateTicketStatus
}






