import { useState, useRef } from "react";
import MailIcon from "@/components/icons/mailicon";
import { useRouter } from "next/router";
import UserIcon from "@/components/icons/user";
import LockIcon from "@/components/icons/lockicon";
import EyeIcon from "@/components/icons/eyeicon";
import EyeOffIcon from "@/components/icons/eyeofficon";
import Link from "next/link";
import Spinner from "@/components/icons/spinner";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);

  //after clicking on register
  const router = useRouter()
  const [finalReg, setFinalReg] = useState(null)
   const [loading, setLoading] = useState(false);

  //this is for all fields check, when a user clicks submit, it checks all the fields
  const [showNoUsername, setShowNoUsername] = useState(false)
  const [showNoemail, setshowNoemail] = useState(false)
  const [showNopassword, setshowNopassword] = useState(false)
  const [showNofullname, setshowNofullname] = useState(false)
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef()
  const fullnameRef = useRef()

  function checkPassword() {
    const enteredPassword = passwordRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current.value;

    if (!enteredConfirmPassword) {
      setPasswordMatch(null); // no message until confirm field is typed
    } else if (enteredConfirmPassword === enteredPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }
  async function submitHandler(event){

setLoading(true)

    event.preventDefault()
    const enteredPassword = passwordRef.current.value;
    const enteredemail = emailRef.current.value;
    const enteredUsername = usernameRef.current.value;
    const enteredfullname =  fullnameRef.current.value
    if(!enteredPassword && !enteredemail && !enteredUsername && !enteredfullname){
 setshowNofullname(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Fullname is required</p>)
 setShowNoUsername(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Username is required</p>)
 setshowNoemail(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Email is required</p>)
 setshowNopassword(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Password is required</p>)
    }

    //this is for fullname
    if(enteredfullname.trim().length<5){
       setshowNofullname(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Fullname must be more than 5 characters</p>)
    }else{
       setshowNofullname(<p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100
text-green-700">Correct Fullname</p>)
    }

//this is for username
    if(enteredUsername.trim().length<3){
       setShowNoUsername(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Username  must be more than 3 characters</p>)
    }else{
 setShowNoUsername(<p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100
text-green-700">Correct Username</p>)
    }

// this is for email
    if(enteredemail.trim().length<5){
       setshowNoemail(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Email  must be more than 5 characters</p>)
    }else{
       setshowNoemail(<p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100
text-green-700">Correct Email </p>)
    } 

   // Define the regex once
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

// Check password
if (!passwordRegex.test(enteredPassword)) {
  setshowNopassword(
    <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
      Password must be at least 8 characters long, and include an uppercase, 
      a lowercase, a number, and a special character.
    </p>
  );
}else{
   setshowNopassword(
    <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
      Correct Password  
    </p>
  );
}
//sending the data to the backend
 const data = {
      fullname: enteredfullname,
      username: enteredUsername,
      email: enteredemail,
      password: enteredPassword,
    };

   
    
    const response = await fetch(
      "/api/register",
      {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
   
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let newPostData = await response.json();
   
    if (!response.ok) {
      setFinalReg(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">{newPostData.message}</p>)
   setLoading(false); // Reset if error
    }else{
      
      setFinalReg( <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
     {newPostData.message}
    </p>)
     await new Promise((resolve) => setTimeout(resolve, 3000));
    router.push('/login')
    }
  }

  return (
    <div className="w-[30%] mx-auto border-4 border-gray-100 p-8 rounded-2xl mt-12 mb-10 bg-white shadow-md">
      {/* Header */}
      <h1 className="text-center text-2xl font-bold text-gray-800">Sign Up</h1>

      <form className="mt-6 space-y-5" onSubmit={submitHandler}>
        {/* Email */}
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <UserIcon className="w-5 h-5" />
            </span>
            <input
              type="text"
              name="fullname"
              id="fullname"
              ref={fullnameRef}
              placeholder="Enter your fullname"
              className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
            
          </div>
          <div>{showNofullname}</div>
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <UserIcon className="w-5 h-5" />
            </span>
            <input
              type="text"
              name="username"
              id="username"
              ref={usernameRef}
              placeholder="Enter your username"
              className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
            
          </div>
          <div>{showNoUsername}</div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <MailIcon className="w-5 h-5" />
            </span>
            <input
              type="email"
              name="email"
              id="email"
              ref={emailRef}
              placeholder="Enter your email"
              className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
          </div>
           <div>{showNoemail}</div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <LockIcon className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              ref={passwordRef}
              onChange={checkPassword}  
              placeholder="Enter your password"
              className="pl-10 pr-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
           <div>{showNopassword}</div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmpassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <LockIcon className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmpassword"
              id="confirmpassword"
              ref={confirmPasswordRef}
              onChange={checkPassword}    
              placeholder="Confirm your password"
              className="pl-10 pr-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Match Message */}
          {passwordMatch === true && (
            <p className="text-green-600 text-sm mt-1">
              ✅ Passwords match
            </p>
          )}
          {passwordMatch === false && (
            <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">
              ❌ Passwords do not match
            </p>
          )}
        </div>

        {/* Sign up button */}
        <button
      type="submit"
      disabled={loading} // Prevent multiple clicks
     
      className={`p-2 rounded-md w-full mt-4 transition flex items-center justify-center 
        ${loading ? "bg-secondary/70 cursor-not-allowed" : "bg-secondary hover:bg-secondary/90 text-white"}`}
    >
      {loading ? (
        // Spinner
         <Spinner className="w-5 h-5"/>
      ) : (
        "Sign Up"
      )}
    </button>
    <div>{finalReg}</div>
      </form>

      {/* Divider */}
      <div className="flex items-center mt-6">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Register button */}
      <div className="flex justify-center">
        <button className="bg-white text-secondary border-2 border-gray-200 p-2 rounded-md w-1/2 mt-5 hover:bg-gray-50 hover:border-secondary transition">
          <Link href="/login">Login</Link>
        </button>
      </div>
    </div>
  );
}
