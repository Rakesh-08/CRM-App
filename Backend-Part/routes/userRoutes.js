const { authJwtValidators } = require("../middlewares/index")
const userController= require("../controllers/userController")


module.exports = (app) => {
    
    app.get("/crm/api/v1/users", [authJwtValidators.verifyToken,authJwtValidators.isAdmin],userController.getAllUsers );
    app.get("/crm/api/v1/users/:userId", [authJwtValidators.verifyToken,authJwtValidators.isAdmin], userController.getUserById);
    app.put("/crm/api/v1/users/:userId", [authJwtValidators.verifyToken,authJwtValidators.isAdmin], userController.updateUserById)
}