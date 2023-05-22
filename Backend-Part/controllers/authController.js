const constants = require("../utils/constants");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig= require("../configs/authConfig")

const signup = async (req, res, next) => {

    let currentUserType = req.body.userType;
    let currentUserStatus = req.body.userStatus;

    if (currentUserType == constants.userTypes.customer) {
        currentUserStatus= constants.userStatus.approved
    } else {
        currentUserStatus = constants.userStatus.pending;
    }

    try {
        const createUser = await User.create({
            name: req.body.name,
            userId: req.body.userId,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
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
            updatedAt:createUser.updatedAt
        }

        res.status(200).send(responseObject)



    } catch (e) {
        console.log("while signing up this error encountered : " + e)
        res.status(500).send({
            message:'some internal error occurred while creating the user'
        })

    }
    
}

const signin = async(req,res,next) => {
    
    const user = await User.findOne({ userId: req.body.userId });
   

    if (!user) {
        res.status(400).send({
            message:"Failed! userid doesn't exist"
        })
        return;

    }
 

    if (user.userStatus !== constants.userStatus.approved) {
        res.status(403).send({
            message:"Can't allow user to login as the userstatus is " + user.userStatus
        })
        return;
    }

// check for password matches or not 
    let isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(401).send({
            message:"Invalid Password"
        })
    }
    
    let token = jwt.sign({ id: user.userId }, authConfig.secretKey, {
        expiresIn:86400
    })


    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus,
        accessToken:token
   })

}

const authController = {
    signup,
    signin
}
module.exports= authController

