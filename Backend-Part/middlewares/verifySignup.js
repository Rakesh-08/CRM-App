const User = require("../models/userModel");
const constants = require("../utils/constants");


const validateSignupRequest = async (req,res, next) => {

    //validate for name
    
    if (!req.body.name) {
    return   res.status(400).send({
            message:"Failed! Name is not passed"
        })
        
    }

    // validate the userId

    if (!req.body.userId) {
   return   res.status(400).send({
            message: "Failed! userId is not passed"
        })
        
    }

    // validate if the userId already exist

    const IsUserIdExist = await User.findOne({ userId: req.body.userId.trim() })
    if (IsUserIdExist) {
       return  res.status(400).send({
            message:"Failed! user with given userId already exist"
        })
     
    }

    // validate email (using regular expression)
   if (!req.body.email) {
        return res.status(400).send({
            message: "please pass the email, it can't be empty"
        })
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
        return res.status(400).send({
            message:"please put valid email "
        })
    }

    // validate email id already exist 
 
    const IsUserEmailExist = await User.findOne({ email: req.body.email })
    if (IsUserEmailExist) {
     
        return  res.status(400).send({
            message: "Failed!  email id already exist"
        })
    }
    
    // validate the password
    
      if(!req.body.password){
          return res.status(400).send({
              message:"please put your password"})}

    // validate the userType

    let currentUserType = req.body.userType;
    const availableUserTypes = [constants.userTypes.customer, constants.userTypes.engineer, constants.userTypes.admin]

    if (currentUserType && !availableUserTypes.includes(currentUserType)) {
   return  res.status(400).send({
          message: "Failed! please pass valid userType"
        })
       
  }

    next();

}



module.exports = validateSignupRequest;







