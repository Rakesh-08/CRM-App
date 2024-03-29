const constants = require("../utils/constants");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/authConfig")
let sendEmailFn=require("../utils/sendEmail")

const signup = async (req, res, next) => {

    let currentUserType = req.body.userType;
    let currentUserStatus;

    if (currentUserType == constants.userTypes.customer) {
        currentUserStatus = constants.userStatus.approved
    } else {
        currentUserStatus = constants.userStatus.pending
    }

    try {

                 let totalUsers = await  User.find({});

        if (totalUsers.length > 15) {
            return res.status(300).send({
                message:"Sorry! this application has limited capacity and its reached its maximum"
            })
        }

        // send email to the admin that somebody has signed up ;
        sendEmailFn();

        
        const createUser = await User.create({
            name: req.body.name,
            userId: req.body.userId.trim(),
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password.trim(), 8),
            userType: req.body.userType,
            userStatus: currentUserStatus

        })

        let responseObject = {
            name: createUser.name,
            email: createUser.email,
            userId: createUser.userId,
            userType: createUser.userType,
            userStatus: createUser.userStatus,
            createdAt: createUser.createdAt,
            updatedAt: createUser.updatedAt
        }

        res.status(200).send(responseObject)



    } catch (e) {

        res.status(500).send({
            message: 'some internal error occurred while creating the user'
        })

    }

}

const signin = async (req, res, next) => {

    const user = await User.findOne({ userId: req.body.userId.trim() });


    if (!user) {
        res.status(400).send({
            message: "Failed! userid doesn't exist"
        })
        return;

    }


    if (user.userStatus !== constants.userStatus.approved) {
        res.status(403).send({
            message: "Can't allow user to login as the userstatus is " + user.userStatus
        })
        return;
    }

    // check for password matches or not 
    let isPasswordValid = bcrypt.compareSync(req.body.password.trim(), user.password);

    if (!isPasswordValid) {
        return res.status(401).send({
            message: "Invalid Password"
        })
    }

    let token = jwt.sign({ id: user.userId }, authConfig.secretKey, {
        expiresIn: 86400
    })


    res.status(200).send({
        _id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus,
        accessToken: token,

    })

}

const authController = {
    signup,
    signin
}
module.exports = authController

