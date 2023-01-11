import  Router  from "next/router"

export const pageNavigation = (ctx,location) => {
    if(ctx.req) { // if it is from server side 
        ctx.res.writeHead(302,{Location:location})
        ctx.res.end()
    }else{ // if it is from the client side
        Router.push(location)
    }
}