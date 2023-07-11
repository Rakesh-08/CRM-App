let mongoose = require("mongoose");


let leadSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },

    mobile: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Users'
    }
    ,

    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
    , updatedAt: {
        type: Date,
        default: () => Date.now()
    }

})

let model = mongoose.model("leadsModel", leadSchema);

module.exports = model;