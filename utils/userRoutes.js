import baseUrl from "./baseUrl"
//export const host = 'http://localhost:3000'
export const userSignupRoute = `${baseUrl}/api/signup/`
export const userLoginRoute = `${baseUrl}/api/auth/`
export const searchUsersRoute = `${baseUrl}/api/search`

export const getAllPostsRoute = `${baseUrl}/api/posts`
export const RouteForLikingAPost = `${baseUrl}/api/posts/like`
export const RouteForUnLikingAPost = `${baseUrl}/api/posts/unlike`
export const routeForThePost = `${baseUrl}/api/posts`
export const routeForPostComment = `${baseUrl}/api/posts/comment`