import HeadTags from '../components/metaData/HeadTags'
import App from "next/app";
import '../styles/globals.css'
import nProgress from "nprogress";
import Router from "next/router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {parseCookies,destroyCookie} from 'nookies'
import { pageNavigation } from '../utils/pageNavigation';
import { userLoginRoute } from '../utils/userRoutes';
import { useEffect } from 'react';

import { store } from '../store'
import { Provider } from 'react-redux'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

function MyApp({ Component, pageProps }) {

  Router.onRouteChangeStart = () => nProgress.start()
  Router.onRouteChangeComplete = () => nProgress.done()
  Router.onRouteChangeError = () => nProgress.done()

  useEffect(() => {
     let title = document.title
  window.addEventListener('blur' , () => {
    document.title = 'Come back :('
  })
  window.addEventListener('focus' , () => {
    document.title = title
  })
  },[])

  return (
    <Provider store={store}>
    <HeadTags />
    <div className='blurBubble bubble1' ></div>
    <div className='blurBubble bubble2' style={{top:'3rem' , right:'1rem'}}></div>
    <Component {...pageProps} />
    <ToastContainer />
    </Provider>
  )
}

MyApp.getInitialProps = async({Component,ctx}) => {0
  try{
    const {FreeBirdUserToken} = parseCookies(ctx)
    const protectedRoutes = ctx.pathname === '/' ||
    ctx.pathname === '/[username]' ||
    ctx.pathname === '/notifications' ||
    ctx.pathname === '/post/[postId]' ||
    ctx.pathname === '/messages' ||
    ctx.pathname === '/search' 
    let pageProps = {}

    if(!FreeBirdUserToken){
      protectedRoutes && pageNavigation(ctx,'/login')
    }else{
      if(Component.getInitialProps) pageProps = await Component.getInitialProps(ctx)

      try{
        const {data} = await axios.get(userLoginRoute, {
          headers: { FreeBirdUserToken: FreeBirdUserToken }
        })
        // console.log(res.data,'is the res from axios')
        const {user,userFollowStats} = data
        if(user && !protectedRoutes) pageNavigation(ctx,'/') // If the user is already logged in and tries to access login/signup page it will redirect user to the home page
        pageProps.user = user
        pageProps.userFollowStats = userFollowStats
      }catch(e){
        console.log(e.message,'is the error')
        destroyCookie(ctx,'FreeBirdUserToken')
        // pageNavigation(ctx,'/login')
      }
    }
    return {pageProps}
  }catch(e){
    console.log(e,'is the error in the my app ip')
  }
}

export default MyApp

// class MyApp extends App {
//   static async getInitialProps({ Component, ctx }) {
//     const { FreeBirdUserToken } = parseCookies(ctx);
//     let pageProps = {};

//     const protectedRoutes = ctx.pathname === "/";

//     if (!FreeBirdUserToken) {
//       protectedRoutes && pageNavigation(ctx, "/login");
//     }
//     //
//     else {
//       if (Component.getInitialProps) {
//         pageProps = await Component.getInitialProps(ctx);
//       }

//       try {
//         const res = await axios.post(`${baseUrl}/api/getUserDetails`)
//         console.log(res.data,'is the data')

//         const { user, userFollowStats } = res.data;

//         if (user) !protectedRoutes && pageNavigation(ctx, "/");

//         pageProps.user = user;
//         pageProps.userFollowStats = userFollowStats;
//       } catch (error) {
//         console.log(error,'is the error')
//         destroyCookie(ctx, "FreebordUserToken");
//         pageNavigation(ctx,'/login')
//       }
//     }

//     return { pageProps };
//   }

//   render() {
//     const { Component, pageProps } = this.props;

//     return (
//          <>
//     <HeadTags />
//     <Component {...pageProps} />
//     <ToastContainer />
//     </>
//     );
//   }
// }

// export default MyApp;