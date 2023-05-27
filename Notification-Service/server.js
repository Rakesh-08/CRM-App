const dbConfig= require("./configs/dbConfig")
const mongoose= require("mongoose")
const serverConfig = require("./configs/serverConfig");
const express = require("express");
const expressApp = express();
const bodyParser = require("body-parser");
  const emailBgJob= require("./crons/emailSenderBGjob")

expressApp.use(bodyParser.json());



mongoose.connect(dbConfig.DB_URL);

let db = mongoose.connection;

db.on("error", err => {
    console.log('Error while connecting to the DB ' + dbConfig.DB_NAME + " " + err.message)
});
db.once("open", () => {
    console.log("connected to the Db " + dbConfig.DB_NAME);
})


// import the routes

require("./routes/ticketNotification")(expressApp);


expressApp.listen(serverConfig.PORT, () => {
    
    console.log("your application is listening on port : "+ serverConfig.PORT)
})









