const jwt = require("jsonwebtoken");
//  const UserModel = require("../models/UserModel");
//  import UserModel from "../models/UserModel";
const mongoose = require('mongoose')
const UserModel = mongoose.model('User')

export const userCookieCheck = async (cookies) => {
  try {
    if (!cookies.FreeBirdUserToken) return false;
    const userId = jwt.verify(cookies.FreeBirdUserToken,process.env.USER_SECRET);
    console.log(userId,'is the user id')
    const user = await UserModel.findById(userId.userId);
    if (user)  return user;
    return false
  } catch (e) {
    return false;
  }
};
