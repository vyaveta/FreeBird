import React from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify'
import css from '../styles/login.module.css'
import Link from 'next/link';
import {IoIosArrowForward} from 'react-icons/io'
import {IoIosArrowBack} from 'react-icons/io'
import {AiFillEye} from 'react-icons/ai'
import {AiFillEyeInvisible} from 'react-icons/ai'
import { Oval } from 'react-loading-icons'
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import {MdDarkMode} from 'react-icons/md'
import {MdLightMode} from 'react-icons/md'
import { changeColorMode } from '../slices/darkModeSlice';
import { useSelector , useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import { registerUser } from '../utils/authUser';
import uploadUserProfilePic from '../utils/uploadPicToCloudinary';

import ImageDropDiv from '../components/ImageDropDiv';


const USER_NAME_REGEX = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const USER_REGEX = /^[a-zA-z][a-zA-Z ]{3,23}$/; // This regex is for the validation of users real name
const PWD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&()/.,_*])[a-zA-Z0-9!@#$%^&()/.,_*]{6,16}$/;
const EMAIL_REGEX =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
let cancelUsernameCheck; // This variable is used to cancel the axios check username request if the request is pending

const Signup = () => {

    const dispatch = useDispatch()
    const darkmode = useSelector((state) => state.darkmode.value)

    const [isDarkMode,setIsDarkMode] = useState(false)

    const changeColorModeFunction = () => {
        Cookies.set('FreeBirdDarkMode',!isDarkMode)
        setIsDarkMode(!isDarkMode)
        dispatch(changeColorMode())
      }

    useEffect(() => {
        if(darkmode === false || darkmode)
        setIsDarkMode(darkmode)
    },[])

    useEffect(() => {
        setIsDarkMode(darkmode)
    },[darkmode])
    
    const [finalSignUpStep,setFinalSignUpStep] = useState(false)

    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('') // this holds the real name of the user
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [pwd, setPwd] = useState('');
    const [media,setMedia] = useState(null)

    const [isGoogleAccount,setIsGoogleAccount] = useState(false)
    const [validName, setValidName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)
    const [validEmail,SetValidEmail] = useState(false)
    const [emailFocus,setEmailFocus] = useState(false)
    const [validPwd, setValidPwd] = useState(false); 
    const [pwdFocus, setPwdFocus] = useState(false);
    const [matchPwd, setMatchPwd] = useState(''); 
    const [validMatch, setValidMatch] = useState(false); 
    const [matchFocus, setMatchFocus] = useState(false);

    
    const [mediaPreview,setMediaPreview] = useState(null)
    const [highlighted,setHighlighted] =useState(false)
    const inputRef = useRef()

    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    const [validUsername,setValidUsername] = useState(false)
    const [usernameLoading,setUsernameLoading] = useState(false)
    const [usernameFocus,setUsernameFocus] = useState(false)

    const [formLoading,setFormLoading] = useState(false)

    const [errMsg,setErrMsg] = useState()

    const toastOptions =  {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    }

    // functions

    const handleError = (msg) => {
        toast.error(msg,toastOptions)
    }

    const handleCallbackGoogle = async (response) => {
        let userObj = await jwt_decode(response.credential)
        console.log(userObj)
       if(userObj){
        console.log(user,email,isGoogleAccount,'is the values')
        const {data} = await axios.post(ClientRegister,{user: userObj.given_name,email: userObj.email,isGoogleAccount:userObj.picture},{withCredentials:true})
       console.log(data,'is the data from the google signin')
      
       if(data.status) {
        toast.success(data.msg,toastOptions);
        navigate('/')
       }
           else   handleError(data.msg)
       }
    }

    const isUsernameAlreadyTaken = async () => {
        try{
            cancelUsernameCheck && cancelUsernameCheck() 
            const CancelToken = axios.CancelToken
            setUsernameLoading(true)
            const {data} = await axios.get(`${baseUrl}/api/signup/${username}`,{cancelToken: new CancelToken(cancelor => {
                cancelUsernameCheck = cancelor
            })})
            if(data.status)  setValidUsername(true)
        }catch(e){
            console.log(e,'is the error that occured in the isUsernameAlreadyTaken')
            setValidUsername(false)
        }finally {
            setUsernameLoading(false)
        }
    }

    // Now some useEffects

    useEffect(() => {
        if(errMsg!=='') handleError(errMsg)
    },[errMsg])

    useEffect(() => {
          userRef.current.focus() // This is to make the focus to the input field on rendering the page
    },[])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result)
    },[user])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email)
        SetValidEmail(result)
    },[email])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd)
        setValidPwd(result)
        const match = pwd === matchPwd
        setValidMatch(match)
    },[pwd,matchPwd])

    useEffect(() => {
        setErrMsg('')
    },[user,pwd,matchPwd])

    useEffect(() => {
        
    },[finalSignUpStep])

    useEffect(() => {
        const result = USER_NAME_REGEX.test(username)
        if(result && username.length > 3) {
            isUsernameAlreadyTaken()
        }
        else setValidUsername(false)
    },[username])
   
    const handleSubmit = async () => {
      if(!validEmail  || !validName || !validUsername ) {
        setFinalSignUpStep(false) 
        handleError('Enter valid Credentials')
        return
      }
      if(!validPwd || !validMatch) return handleError('Enter valid password')
      setFormLoading(true)
      let profilePicUrl
      if(media!==null) {
        profilePicUrl = await uploadUserProfilePic(media)
      }
      if(media!==null && !profilePicUrl){
        handleError('Error occured while setting up profile pic')
      }
      await registerUser(user,username,email,pwd,profilePicUrl,setErrMsg,setFormLoading)
    }

    const checkFinalSignUpStep = () => {
         if(validName && validUsername && validEmail ) setFinalSignUpStep(true)
       else handleError('Input your details correctly and try again!')
    }

    const setProfile = (e) => {
        try{
        const files = e.target.files
        setMedia(files[0])
        console.log(files,'is the files')
        setMediaPreview(URL.createObjectURL(files[0]))
        }catch(err){
            handleError('Select a valid image for profile')
        }  
    }

  return (
        <div className={ isDarkMode ?`${css.login__wrapper} ${css.darkmode}` : `${css.login__wrapper}`}>
            <div className={css.clouds}>
            {
           
             !isDarkMode &&  <>
             <img src='/cloud.png' alt="" />
             <img src='/cloud.png' alt="" />
             </>
           
           }
            {/* <img src='/cloud.png' alt="" />
            <img src='/cloud.png' alt="" /> */}
        </div>
            <div className={css.login__container}>
                {
                    !finalSignUpStep && 
            <>
                    <div className={css.login__title}>
                    <h2>Register</h2>
                </div>

                <div className={css.login__box}>
                    <div className={css.input__div__2}>
                    <input type="text" name="" id="username" placeholder='Real name' ref={userRef} 
                    onChange = {(e) => setUser(e.target.value)}
                    value ={user}
                    aria-invalid = {validName ? 'false' : 'true'}
                    autoComplete = 'off'
                    aria-describedby='uidnote'
                    onFocus={ () => setUserFocus(true)}
                    onBlur = { () => setUserFocus(false)}
                    />
                    <label htmlFor=""> 
                    <span className={validName ? 'valid' : 'hide'}>
                        <FontAwesomeIcon icon={faCheck} className='the_small_icon'  />
                    </span>
                    <span className={validName || !user ? 'hide' : 'invalid'}>
                        <FontAwesomeIcon icon={faTimes} className='the_small_icon'  />
                    </span>
                    </label>
                    </div>
                    <p id='uidnote' className={  userFocus && user && !validName ? 'instructions ' : 'offscreen '}>
                    <FontAwesomeIcon icon={faInfoCircle} className='the_small_icon'  />
                    &nbsp; Enter your real name here
                    </p>
                </div>
                <div className={css.login__box}>
                   <div className={css.input__div__2}>
                   <input type="email" placeholder='Email' name="" id=""
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}
                    onFocus = {() => setEmailFocus(true)}
                    onBlur = {() => setEmailFocus(false)}
                    />
                    <label htmlFor="">
                        <span className={email && validEmail ? 'valid' : 'hide'} >
                        <FontAwesomeIcon icon={faCheck} className='the_small_icon'  />
                        </span>
                        <span className={ email && !validEmail ? 'invalid' : 'hide' }>
                        <FontAwesomeIcon icon={faTimes} className='the_small_icon'  />
                        </span>
                    </label>
                   </div>
                   <p  className={  emailFocus && email && !validEmail ? 'instructions ' : 'offscreen '}>
                    <FontAwesomeIcon icon={faInfoCircle} className='the_small_icon' />
                    &nbsp; Try to enter a valid email.
                    </p>
                </div>
                <div className={css.login__box}>
                        <div className={css.input__div__2}>
                        <input type="text" name="" id="username" placeholder='User name' 
                        onChange = {(e) => setUsername(e.target.value)}
                        value ={username}
                        aria-invalid = {validUsername ? 'false' : 'true'}
                        autoComplete = 'off'
                        aria-describedby='uidnote'
                        onFocus={ () => setUsernameFocus(true)}
                        onBlur = { () => setUsernameFocus(false)}
                        />
                        <label htmlFor=""> 
                        <span className={validUsername ? 'valid' : 'hide'}>
                            <FontAwesomeIcon icon={faCheck} className='the_small_icon'  />
                        </span>
                        <span className={validUsername || !username ? 'hide' : 'invalid'}>
                            {
                                usernameLoading ? <Oval className='the_small_icon' stroke="#1e90ff" strokeWidth={5} speed={.75}  /> :  <FontAwesomeIcon icon={faTimes} className='the_small_icon'  />
                            }
                           
                        </span>
                        </label>
                        </div>
                        <p id='uidnote' className={  usernameFocus && username && !validUsername ? 'instructions ' : 'offscreen '}>
                        <FontAwesomeIcon icon={faInfoCircle} className='the_small_icon'  />
                        &nbsp; This name must be unique.
                        </p>
                        </div>
                
                <div className={css.login__box}>
                    <button className="login__button" onClick={checkFinalSignUpStep} >Final Step <IoIosArrowForward/> </button>
                </div>
                <div className="login__box" id='googleSignIn'></div>
                <div className={css.login__box}>
                    <p className={css.bottom__text} >Already have an Account? <span 
                    style={{ textDecoration: 'underline', cursor: 'pointer' }} 
                    ><Link href='/login' >Sign In</Link></span> </p>
                    <p ref={errRef} className = {errMsg ? 'errmsg' : 'offscreen'} aria-live= 'assertive' >{errMsg}</p>
                </div>
            </>
                }

                {
                    finalSignUpStep && 
                    (
                        <>
                        <ImageDropDiv mediaPreview={mediaPreview} setMediaPreview={setMediaPreview} setMedia={setMedia} inputRef={inputRef} highlighted={highlighted} setHighlighted={setHighlighted} handleChange={setProfile}  />
                        <div className={css.secondContainer}>
                        <div className={css.login__box}>
                   <div className={css.input__div__2}>
                   <input type= {showPassword ? 'text' : 'password'} 
                    placeholder='password' name="" id=""
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    aria-invalid = {validPwd ? 'false' : 'true'}
                    onFocus={ () => setPwdFocus(true)}
                    onBlur = { () => setPwdFocus(false)}
                    />
                    <label htmlFor="">
                    <span className={validPwd ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} className='the_small_icon' />
                    </span>
                    <span className={  !validPwd && pwd ? 'invalid' : 'hide'} >
                    <FontAwesomeIcon icon={faTimes} className='the_small_icon' />
                    </span>
                    {
                        showPassword ? ( <AiFillEyeInvisible
                            onClick={() => setShowPassword(false)}
                            className={css.loginShowPasswordIcon} 
                            /> ) : ( <AiFillEye
                                onClick={() => setShowPassword(true)}
                                className={css.loginShowPasswordIcon} 
                                /> )
                    }
                   </label>
                   </div>
                   <p  className={  pwdFocus && pwd && !validPwd ? 'instructions ' : 'offscreen '}>
                    <FontAwesomeIcon icon={faInfoCircle}className='the_small_icon'  />
                      &nbsp; 6 to 16 characters. Must contain alphabet, number and special characters.
                    </p>
                </div>
                <div className={css.login__box}>
                    <div className={css.input__div__2}>
                    <input type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder='confirm password'
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    onFocus = {() => setMatchFocus(true)}
                    onBlur = {() => setMatchFocus(false)}
                    />
                    <label htmlFor="">
                        <span className={validPwd  && validMatch && pwd ? 'valid' : 'hide' }>
                        <FontAwesomeIcon icon={faCheck} className='the_small_icon' />
                        </span>
                        <span className={(matchPwd && !validMatch) || (!validPwd && matchPwd) ? 'invalid' : 'hide'} >
                         <FontAwesomeIcon icon={faTimes} className='the_small_icon' />
                    </span>
                    {
                        showConfirmPassword ? ( <AiFillEyeInvisible
                            onClick={() => setShowConfirmPassword(false)}
                            className={css.loginShowPasswordIcon} 
                            /> ) : ( <AiFillEye
                                onClick={() => setShowConfirmPassword(true)}
                                className={css.loginShowPasswordIcon} 
                                /> )
                    }
                    </label>
                    </div>
                    <p className={ matchPwd && matchFocus && !validMatch ? 'instructions': 'offscreen' }>
                        <FontAwesomeIcon icon={faInfoCircle} className='the_small_icon'  />
                      &nbsp; Make sure you have entered the correct password!.
                        </p>
                </div>
                <div className={css.login__box}>
                    <div className={css.input__div__2} >
                    <button className="login__button" onClick={() => setFinalSignUpStep(false)} >Go Back<IoIosArrowBack/> </button>
                    </div>
                </div>

                <div className={css.login__box}>
                    <button className="login__button" onClick={handleSubmit} > 
                        {
                            formLoading ? <Oval style={{height:'15px'}} stroke="#1e90ff" strokeWidth={5} speed={.75}  />
                            : 'Sign up'
                        }
                    <IoIosArrowForward/> </button>
                </div>
                        </div>
                        </>
                    )
                }
            </div>

            <div className={css.darkmodeBox}>
        <button className={isDarkMode ? `${css.darkmodeButton}` : css.lightmodeButton} onClick={changeColorModeFunction}> 
         {
          isDarkMode ? <MdDarkMode/> : 
           <MdLightMode />
         }
       </button>
      </div>

        </div>
    )
}

export default Signup