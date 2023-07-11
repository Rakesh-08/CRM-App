let UsersModel = require("../models/userModel");

let leadAuthorisation = async (req, res, next) => {

    try {
        let caller = await UsersModel.findOne({
            userId: req.userId
        })

        if (!(caller.userType == "ADMIN" || caller.userType == 'SALES_REP')) {
            return res.status(401).send({
                message:"unauthorised ! only admins and saler rep are allowed to access this route"
            })
        }

        if ( caller.userStatus !== 'APPROVED') {
            return res.status(403).send({
                message:"can't access this route until your user status got approved"
            })

        } 

        next();
        
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "some internal server error occurred"
        })
    }
    
}

module.exports=leadAuthorisation




