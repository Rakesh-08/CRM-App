const mongoose = require('mongoose');

const userShchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    userId: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    userType: {
        type: String,
        required: true,
        default:'CUSTOMER'
    },
    userStatus: {
        type: String,
        default:'PENDING'
    },
    createdAt: {
        type: Date,
        immutable: true,
        default:()=>{return Date.now()}
    },
    updatedAt: {
        type: Date,
         default: () => { return Date.now() }
    }
})

module.exports = mongoose.model('Users',userShchema)






