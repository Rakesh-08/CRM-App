const jwt = require("jsonwebtoken");
const authConfig = require("../configs/authConfig");
const User = require("../models/userModel");
const constant = require("../utils/constants")

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            message: "No token has been passed"
        })
    }

    jwt.verify(token, authConfig.secretKey, (err, decoded) => {

        if (err) {
            console.log(err)
            console.log(decoded)
            return res.status(401).send({
                message: "Request cannot be authenticated. Token is invalid"
            })
        }
        req.userId = decoded.id;
        next();
    })


}

const isAdmin = async (req, res, next) => {

    let user = await User.findOne({
        userId: req.userId
    })

    if (user && user.userType == constant.userTypes.admin) {
        next();

    } else {
        return res.status(403).send({
            message: "Only admins are allowed to access this operation "
        })
    }

}

const authJwtValidators = {
    verifyToken,
    isAdmin
}

module.exports = authJwtValidators






