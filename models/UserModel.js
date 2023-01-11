const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    name:{
        type: String , required: true
    },
    email: {
        type: String, required: true , unique: true
    },
    password: {
        type: String, required: true , select: false // here I have set select to false. That means when we retrive the user object from the database , by default this field will not be selected or retrived!
    },
    username: {
        type: String, required: true , unique: true , trim: true
    },
    profilePicUrl: {
        type: String 
    },
    isBanned: {
        type: Boolean , default: false
    },
    isPremium: {
        type: Boolean , default: false
    },
    totalReportsObtained: {
        type: Number , default: 0
    },
    totalReportsSubmitted: {
     type: Number , default: 0
    },
    totalProfileViews:  {
       type: Number , default: 0
    },
    newMessagePopup: {
        type: Boolean , default: true
    },
    unreadMessage: {
        type: Boolean , default: false
    },
    unreadNotification: {
        type: Boolean , default: false
    },
    role: {
        type: String , default: 'user' , enum: ['user' , 'root'] // This enum basically tells that there can only be 'user' and 'root' types of values in the role  
     },
     resetToken: {
        type: String
     },
     expireToken: {
        type: Date
     } // This reset token and expire token is used to reset the user password.
}, {timestamps: true})

module.exports =  mongoose.model('User' , UserSchema)