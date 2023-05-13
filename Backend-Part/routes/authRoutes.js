const authController = require("../controllers/authController");

module.exports = function (app) {
    app.post("/crm/api/v1/auth/signup",[], authController.signup)
}


