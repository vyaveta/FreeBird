const express = require('express')
const router = express.Router()
const UserModel = require('../../models/UserModel')
const userAuthMiddleware = require("../../middlewares/userAuthMiddleware")

router.get('/:searchText',userAuthMiddleware, async (req,res) => {
    try{
        const {searchText} = req.params
        if(searchText.length===0) return res.json({status: false,msg:'search params are empty'})
        let userPattern = new RegExp(`^${searchText}`)
        const results = await UserModel.find({$or:[{name:{$regex:userPattern,$options:'i'}},{username:{$regex:userPattern,$options:'i'}}]}) // $options i means that it will not be case sensitive
        return res.json({status: true,results})
    }catch(e){
        console.log(e,'is the error that occured in the users search get req in the search.js file')
        return res.json({status: false,msg: 'Internal Server error'})
    }
})

module.exports = router