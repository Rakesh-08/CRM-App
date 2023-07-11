
let { createLeads, getAllLeads, getleadById, updatelead } = require("../controllers/leadsController")
let {authJwtValidators } = require("../middlewares/index");
const leadAuthorisation = require("../middlewares/leadAuthorisation");

module.exports = (app) => {
    
    app.post("/crm/api/v1/leads",createLeads);
    app.get("/crm/api/v1/leads", [authJwtValidators.verifyToken,leadAuthorisation], getAllLeads);
    app.get("/crm/api/v1/lead/:leadId", [authJwtValidators.verifyToken,leadAuthorisation], getleadById);
    app.put("/crm/api/v1/lead/:leadId",[authJwtValidators.verifyToken, leadAuthorisation], updatelead)
}