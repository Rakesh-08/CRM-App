const mongoose = require("mongoose");


const ticketSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required:true
    },

    ticketPriority: {
        type: Number,
        required: true,
        default:4
    },
    description: {
        type: String,
        required:true
    },
    status: {
        type: String,
        required: true,
        default:"OPEN"
    },
    reporter: {
        type: String,
        required:true
    },
    
    reporterName: {
    type: String,
    required: true
}
   ,
    assignee: {
        type: String,
         required:true
    },
    assigneeName: {
        type: String,
        required:true
    },
    comments: {
        type: String
    }
    ,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => {
            return Date.now()
        }
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now()
        }
        
    }
    

})

module.exports = mongoose.model("Ticket",ticketSchema);



