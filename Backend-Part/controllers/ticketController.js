const Ticket = require("../models/ticketModel")
const User = require("../models/userModel");
const constants = require("../utils/constants")

const createTicket = async (req, res) => {

    const ticketObject = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description,
        status: req.body.status,
        reporter: req.userId, // this is coming from authjwt middleware


    }

    const engineer = await User.findOne({
        userType: constants.userTypes.engineer,
        userStatus: constants.userStatus.approved
    })

    ticketObject.assignee = engineer.userId

    try {
        const ticket = await Ticket.create(ticketObject);

        if (ticket) {

            // update the customer 
            const user = await User.findOne({
                userId: req.userId
            })
            user.ticketsCreated.push(ticket._id);
            await user.save();

            // update the engineer

            if (engineer) {
                engineer.ticketsAssigned.push(ticket._id);
                await engineer.save();
            }

            res.status(200).send(ticket)

        }
    } catch (err) {
        return res.status(500).send({
            message: "some internal error occurred"
        })
    }
}

const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({
            _id: req.params._id
        })

        // ticket can  be updated by the user who created that ticket 
        if (!ticket) {
            res.status(400).send({
                message: "ticket does not exist"
            })
        } else if (ticket && ticket.reporter === req.userId) {
            let updatePassed = req.body;

            let updatedTicket = await Ticket.findOneAndUpdate({
                _id: ticket._id
            }, updatePassed, { new: true })

            res.status(200).send(updatedTicket);

        } else {
            res.status(200).send({
                message: "only user who created this ticket can update this"
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }

}

const getAllTickets = async (req, res) => {

}

const getTicketById = async (req, res) => {

}

module.exports = {
    createTicket,
    updateTicket, getAllTickets,
    getTicketById
}










