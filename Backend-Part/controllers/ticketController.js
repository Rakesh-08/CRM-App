const Ticket = require("../models/ticketModel")
const User = require("../models/userModel");
const ticketRoutes = require("../routes/ticketRoutes");
const constants = require("../utils/constants");
const sendEmail = require("../utils/notificationClient");

const createTicket = async (req, res) => {

    const ticketObject = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description,
        status: req.body.status,
        reporter: req.userId, // this is coming from authjwt middleware


    }

    // const engineer = await User.findOne({
    //     userType: constants.userTypes.engineer,
    //     userStatus: constants.userStatus.approved
    // })

    // ticketObject.assignee = engineer.userId

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

            // if (engineer) {
            //     engineer.ticketsAssigned.push(ticket._id);
            //     await engineer.save();
            // }


            sendEmail(ticket._id, `ticket created with ticket id : ${ticket._id
                }`, ticket.description, [user.email], ticket.reporter)


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

        // ticket can  be updated by the user who created that ticket or engineer assigned to that ticket or (admin itself)

        let caller = await User.findOne({
            userId: req.userId
        })
        let isAdmin = null;

        if (caller.userStatus == "APPROVED" && caller.userType== "ADMIN") {
            isAdmin = caller;
        }

        if (!ticket) {
            res.status(400).send({
                message: "ticket does not exist"
            })
        } else if (ticket && (ticket.reporter === req.userId || ticket.assignee == req.userId || isAdmin)) {
            let updatePassed = req.body;

            let updatedTicket = await Ticket.findOneAndUpdate({
                _id: ticket._id
            }, updatePassed, { new: true })


            sendEmail(updatedTicket._id, `Update with : ${updatedTicket._id
                } ticket id`, updatedTicket.description, [caller.email],updatedTicket.reporter)


            res.status(200).send(updatedTicket);

        } else {
            res.status(200).send({
                message: "only user and engineer connected with ticket can update this"
            })
        }



    } catch (err) {
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }

}

const getAllTickets = async (req, res) => {

    try {
        let allTicketIds;

        // if request is from customer or engineer;

        let Request = await User.findOne({
            userId: req.userId
        }).select("ticketsCreated ticketsAssigned");

        // if the request is coming from a admin

        let isAdmin = await User.findOne({
            userId: req.userId,
            userStatus: "APPROVED",
            userType: "ADMIN"
        })

        if (Request.ticketsCreated && Request.ticketsCreated.length > 0) {
            allTicketIds = Request.ticketsCreated;

        } else if (Request.ticketsAssigned && Request.ticketsAssigned.length > 0) {
            allTicketIds = Request.ticketsAssigned;
        }

        let Tickets;

        if (allTicketIds) {

            Tickets = await Ticket.find({
                _id: {
                    $in: allTicketIds
                }
            })
            res.status(200).send(Tickets);
        } else if (isAdmin) {
            Tickets = await Ticket.find();
            res.status(200).send(Tickets)
        } else {
            res.status(200).send({
                message: "No Tickets exist for you"
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }

}

const getTicketById = async (req, res) => {

    try {
        const ticket = await Ticket.findOne({
            _id: req.params._id
        })

        // ticket can be seen to  user who created that ticket or engineer assigned to that ticket or (admin itself);


        let isAdmin = await User.findOne({
            userId: req.userId,
            userStatus: "APPROVED",
            userType: "ADMIN"
        });


        if (!ticket) {
            res.status(400).send({
                message: "ticket does not exist"
            })
        } else if (ticket && (ticket.reporter === req.userId || ticket.assignee == req.userId || isAdmin)) {

            res.status(200).send(ticket);

        } else {
            res.status(200).send({
                message: "only user and engineer connected with this ticket can access this"
            })
        }



    } catch (err) {
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
}

const assignTicketToEngineer = async (req, res) => {
    const { ticketId, engineerAssigned } = req.body;

    let ticket = await Ticket.findById({
        _id: ticketId
    });
    let engineer = await User.findOne({
        userId: engineerAssigned
    });

    if (!ticket) {
        return res.status(400).send({
            message: "No such ticket exist"
        })
    } else if (!engineer) {
        return res.status(400).send({
            message: "No engineer exist with this given id"
        })
    } else if (ticket.assignee) {
        return res.status(200).send({
            message: "engineer already assigned to this ticket"
        })
    } else {
        ticket.assignee = engineerAssigned;
        engineer.ticketsAssigned.push(ticketId)

        await ticket.save();
        await engineer.save();
        res.status(200).send({
            message: "ticket is successfully assigned to given engineer"
        })
    }

}

module.exports = {
    createTicket,
    updateTicket, getAllTickets,
    getTicketById,
    assignTicketToEngineer
}










