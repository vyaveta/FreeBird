// import { createSlice } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";

// let userCookie = Cookies.get('FreeBirdUserToken') 
// console.log(userCookie,'is the userCookie')
// if (userCookie == null || userCookie == undefined || !userCookie) userCookie = false

// const initialState = {
//     value: {
//         headers: {
//             'Content-Type': 'application/json',
//             'freebirdusertoken': userCookie
//           }
//     }
// }

// export const userAuthHeaderSlice = createSlice({
//     name:'userAuthHeader',
//     initialState,
//     reducers:{
//         userLogout: state => {
//             state.value = false
//         },
//         userLogin: state => {
//             state.value = initialState.value
//         }
//     }
// })

// export const {userLogout,userLogin} = userAuthHeaderSlice.actions

// export default userAuthHeaderSlice.reducer