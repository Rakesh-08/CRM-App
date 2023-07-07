const User = require("../models/userModel");

const secureObjectResponse = require("../utils/convertUserObject");
const constants = require("../utils/constants")

const getAllUsers = async (req, res) => {

    let queryObject = {};

    if (req.query.userStatus) {
        queryObject.userStatus = req.query.userStatus;
    }

    if (req.query.userType) {
        queryObject.userType = req.query.userType;
    }

    try {
        let allUsers = await User.find(queryObject);

        if (allUsers) {
            res.status(200).send({
                Data: secureObjectResponse(allUsers),
                message: "sucessfully fetched all the users"
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
}

const getUserById = async (req, res) => {
    let requestedUserId = req.params.userId;

    let result = await User.findOne({
        userId: requestedUserId
    })
    if (result) {
        res.status(200).send(secureObjectResponse([result]))
    } else {
        res.status(200).send({
            message: "user doesn't exist"
        })
    }

}

const updateUserById = async (req, res) => {

    try {
        let objectPassed = req.body;

        let invalidRequest = Object.keys(objectPassed).find(key => {
            if (key === "userId" || key === "password" || key === "email") {
                return key;

            }
        })
        if (invalidRequest) {
            return res.status(401).send({
                message: `you cannot update the ${invalidRequest}`
            })
        }

      console.log(objectPassed.userId)

        let userToBeUpdated = await User.findOneAndUpdate({
            userId: req.params.userId
        }, { ...objectPassed }, {
            new: true
        })
        if (userToBeUpdated) {
           

            res.status(200).send(secureObjectResponse([userToBeUpdated]))
        } else {
            res.status(400).send({
                message: `user with ${req.params.userId} doesn't exist`
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "some internal server error"
        })
    }





}


module.exports = {
    getAllUsers,
    getUserById,
    updateUserById
}








