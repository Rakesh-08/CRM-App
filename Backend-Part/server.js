
const mongoose = require("mongoose");

const serverConfig = require("./configs/serverConfig");
const dbConfig = require("./configs/dbConfig");
const User = require("./models/userModel");
const bcrypt = require('bcryptjs')

//express setup

const bodyParser = require("body-parser");
const express = require('express');
const expressApp = express();
const cors = require("cors");

expressApp.use(cors())
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }))


require("dotenv").config();
// establish connectin with mongodb and check admin already there or not

mongoose.connect(dbConfig.DB_URL)

const db = mongoose.connection;
db.on('err', () => {
    console.log( "Error encountered while connecting to mongodb")
})
db.once('open', () => {
    console.log("connection with mongodb successfull")

    // if admin is there then good else create the admin

    init();
})

async function init() {
    
    let user = await User.findOne({ userId: 'admin' })
    
    if (user) {
        console.log('Admin is already exist');
        return 
    }
 
    try {
        user = await User.create({
            name: "Rakesh",
            userId: 'admin',
            email: 'Mandal@gmail.com',
            userStatus:'APPROVED',
            userType: 'ADMIN',
            password: bcrypt.hashSync('sample1')
        })
       
        
    } catch (e) {
        console.log('Error while creating admin user: '+ e)
    }


}
// import the routes

require('./routes/authRoutes')(expressApp);
require("./routes/userRoutes")(expressApp);
require("./routes/ticketRoutes")(expressApp);

expressApp.get("/", (req,res) => {
    res.write("You are on your home Page and congrats your backend server is deployed successfully");
    res.end();
})


// server should be up and running at port 8080

expressApp.listen(serverConfig.PORT, () => {
    console.log('server is listening at port ' + serverConfig.PORT)
})




