let leadsModel = require('../models/leadsModel');
let UsersModel = require("../models/userModel")
let constants = require("../utils/constants")

let createLeads = async (req, res) => {

    try {

        let obj = {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            mobile: req.body.mobile,
            address: req.body.address
        }

        let salesPerson = await UsersModel.findOne({
            userType: constants.userTypes.sales_rep,
            userStatus: constants.userStatus.approved
        })



        // assign salesPerson;
        if (salesPerson) {
            obj.assignedTo = salesPerson._id;
        }

        let lead = await leadsModel.create(obj);


        // inform sales rep for new lead;
        salesPerson?.leadsAssigned.push(lead._id)
        await salesPerson.save();

        res.status(200).send(lead);

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }

}

let getAllLeads = async (req, res) => {
    try {

        let caller = await UsersModel.findOne({
            userId: req.userId
        })

        let allLeads;

        if (caller.userType == "ADMIN") {
            allLeads = await leadsModel.find({})

        } else if (caller.userType == 'SALES_REP') {
            allLeads = await leadsModel.find({
                assignedTo: caller._id
            })
        } else {
            return res.status(401).send({
                message: "Unauhtorised request ! only admins and sales representatives are allowed to make this request"
            })
        }

        if (allLeads.length > 0) {
            res.status(200).send(allLeads)
        } else {
            res.status(200).send({
                message: "no leads to show"
            })
        }



    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
}

let getleadById = async (req, res) => {
    try {

        let lead = await leadsModel.findOne({
            _id: req.params.leadId
        });

        if (!lead) {
            return res.status(400).send({
                message: `there is no lead with id ${req.params.leadId}`
            })
        }

        res.status(200).send(lead)

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
}

let updatelead = async (req, res) => {
    try {

        let updatePassed = req.body;


        let lead = await leadsModel.findOneAndUpdate({
            _id: req.params.leadId
        }, updatePassed, {
            new: true
        })


        if (lead) {
            res.status(200).send(lead)
        } else {
            res.status(400).send({
                message: "there is no lead exist "
            })
        }


    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
}

module.exports = {
    createLeads, getAllLeads, getleadById, updatelead
}