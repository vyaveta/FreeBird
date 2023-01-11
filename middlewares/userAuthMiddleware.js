const jwt = require('jsonwebtoken')
// const Router = require('next/router')
const { parseCookies, setCookie, destroyCookie } = require('nookies')

module.exports = (req,res,next) => {
    try{
        console.log('got inside middleware ')
        // this code doesnt require headers in the get request thats why im using this
        console.log(req,'is the req')
        const parsedCookies =  parseCookies({ req });
        console.log(parsedCookies,'is the cookies')
        const c = parsedCookies.FreeBirdUserToken
        if(!parsedCookies.FreeBirdUserToken) {
            console.log('no fbu token')
            return res.json({status: false,msg:'Failed to find freebird cookie in the req'})
        }
        const {userId} = jwt.verify(c,process.env.USER_SECRET)
        req.userId = userId
        console.log(userId)
        //This code do require headers in the get request

        // if(!req.headers.FreeBirdUserToken)  return res.redirect('/login')
        // const {userId} =  jwt.verify(req.headers.FreeBirdUserToken,process.env.USER_SECRET)
        // console.log(userId,'is the userId from middleware')
        // req.userId = userId
         next()
    }catch(err){
        console.log(`${err} is the error in the user auth middleware`)
        return res.json({status: false,msg:'error occured in the auth middleware',error: err})
    }
}