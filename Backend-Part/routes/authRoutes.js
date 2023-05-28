const authController = require("../controllers/authController");
const authValidators = require("../middlewares/index")

module.exports = function (app) {
    app.post("/crm/api/v1/auth/signup", [authValidators.verifySignup], authController.signup)
    app.post("/crm/api/v1/auth/signin", [], authController.signin)
}


