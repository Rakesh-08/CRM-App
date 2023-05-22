const User = require("../models/userModel");
const constants = require("../utils/constants");


const validateSignupRequest = async (req,res, next) => {

    //validate for name
    
    if (!req.body.name) {
        res.status(400).send({
            message:"Failed! Name is not passed"
        })
        return;
    }

    // validate the userId

    if (!req.body.userId) {
        res.status(400).send({
            message: "Failed! userId is not passed"
        })
        return;
    }

    // validate if the userId already exist

    const IsUserIdExist = await User.findOne({ userId: req.body.userId })
    if (IsUserIdExist) {
        res.status(400).send({
            message:"Failed! user with given userId already exist"
        })
        return
    }

    // validate email (using regular expression)


    // validate email id already exist 
 
    const IsUserEmailExist = await User.findOne({ email: req.body.email })
    if (IsUserEmailExist) {
        res.status(400).send({
            message: "Failed!  email id already exist"
        })
        return
    }

    // validate the userType

    let currentUserType = req.body.userType;
    const availableUserTypes = [constants.userTypes.customer, constants.userTypes.engineer, constants.userTypes.admin]

    if (currentUserType && !availableUserTypes.includes(currentUserType)) {
        res.status(400).send({
          message: "Failed! please pass valid userType"
        })
        return;
  }

    next();

}



module.exports = validateSignupRequest;







