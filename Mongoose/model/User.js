import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        minLength: 8,
        required:true
    }
})

const User = model('Users', userSchema);
export default User;
