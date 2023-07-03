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
        comments: req.body.comments,
        reporter: req.userId, // this is coming from authjwt middleware

    }
 try {
    const engineer = await User.findOne({
        userType: constants.userTypes.engineer,
        userStatus: constants.userStatus.approved
    })
     
     // update the customer 
     const user = await User.findOne({
         userId: req.userId
     })

     if (engineer) {
         ticketObject.assignee = engineer.userId;
         ticketObject.assigneeName = engineer.name;
     }

     
     ticketObject.reporterName = user.name;

   
        const ticket = await Ticket.create(ticketObject);

        if (ticket) {

           
            user.ticketsCreated.push(ticket._id);
            await user.save();

            // update the engineer

            if (engineer) {
                engineer.ticketsAssigned.push(ticket._id);
                await engineer.save();
            }


            sendEmail(ticket._id, `ticket created with ticket id : ${ticket._id
                }`, ticket.description, [user.email], ticket.reporter)


            res.status(200).send(ticket)

        }
    } catch (err) {
        return res.status(500).send({
            message: "some internal server error occurred"
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

        let customerEmail = caller.email;

        if (caller.userId !== ticket.reporter) {
            let customer = await User.findOne({
                userId: ticket.reporter
            }).select({ email: 1, _id: 0 });

            customerEmail = customer.email;
        }
        let isAdmin = null;

        if (caller.userStatus == "APPROVED" && caller.userType== "ADMIN") {
            isAdmin = caller;
        }

        if (!ticket) {
            res.status(404).send({
                message: "ticket does not exist"
            })

        } else if (ticket && (ticket.reporter === req.userId || ticket.assignee == req.userId || isAdmin)) {


            let updatePassed = req.body;

            let updatedTicket = await Ticket.findOneAndUpdate({
                _id: ticket._id
            }, updatePassed, { new: true });


            if (ticket.reporter !== req.userId) {
                
                let content = `Hello sir,/n there was an update in your ticket ,to look into update visit the support page. /n regards
           CRM support service`
               
               

                sendEmail(updatedTicket._id, `Update in ticket id : ${updatedTicket._id} `, content, [customerEmail], updatedTicket.reporter)


            }
  
           

            res.status(200).send(updatedTicket);

        } else {
            res.status(401).send({
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
            res.status(400).send({
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
            res.status(404).send({
                message: "ticket does not exist"
            })
        } else if (ticket && (ticket.reporter === req.userId || ticket.assignee == req.userId || isAdmin)) {

            res.status(200).send(ticket);

        } else {
            res.status(401).send({
                message: "only user and engineer connected with this ticket can access this"
            })
        }



    } catch (err) {
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
}

const deleteTicket = async (req, res) => {

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
            res.status(404).send({
                message: "ticket does not exist"
            })
        } else if (ticket && (ticket.reporter === req.userId || ticket.assignee == req.userId || isAdmin)) {
            let deleteResponse= await  Ticket.deleteOne({
                _id:req.params._id 
            });

            res.status(200).send({...deleteResponse,_id:ticket._id});

        } else {
            res.status(401).send({
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
        return res.status(404).send({
            message: "No such ticket exist"
        })
    } else if (!engineer) {
        return res.status(404).send({
            message: "No engineer exist with this given id"
        })
    } else if (ticket.assignee) {
        return res.status(400).send({
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


let sendEmailToCustomer = async (req, res) => {
    

    try {
  let  {ticketId, userId, subject, content }= req.body;

    let requester = await User.findOne({
        userId:req.userId
    })

    if (requester.userType === constants.userTypes.customer) {
        return res.status(401).send({
            message:"unauthorised request ! you are not allowed to send email"
        })
    }
    let customer = await User.findOne({
        userId:userId
    })

    sendEmail(ticketId, subject, content, [customer.email], userId)
    
    res.status(200).send({
        message:"email send successfully"
    })
        
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "some internal servor error occurred"
        })
    }

}


module.exports = {
    createTicket,
    updateTicket, getAllTickets,
    getTicketById,
    deleteTicket,
    assignTicketToEngineer,
    sendEmailToCustomer
}










