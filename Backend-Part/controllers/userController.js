const User = require("../models/userModel");

const secureObjectResponse = require("../utils/convertUserObject")

const getAllUsers = async (req, res) => {

    try {
        let allUsers = await User.find();

        if (allUsers) {
            res.status(200).send({
                Data: secureObjectResponse(allUsers),
                message: "sucessfully fetched all the users"
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "some internal server occurred"
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

const updateUserById = (req, res) => {

}


module.exports = {
    getAllUsers,
    getUserById,
    updateUserById
}








