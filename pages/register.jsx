import { useState, useRef } from "react";
import MailIcon from "@/components/icons/mailicon";
import UserIcon from "@/components/icons/user";
import LockIcon from "@/components/icons/lockicon";
import EyeIcon from "@/components/icons/eyeicon";
import EyeOffIcon from "@/components/icons/eyeofficon";
import Link from "next/link";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);

  //this is for all fields check, when a user clicks submit, it checks all the fields
  const [showNoUsername, setShowNoUsername] = useState(false)
  const [showNoemail, setshowNoemail] = useState(false)
  const [showNopassword, setshowNopassword] = useState(false)
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef()

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
    event.preventDefault()
    const enteredPassword = passwordRef.current.value;
    const enteredemail = emailRef.current.value;
    const enteredUsername = usernameRef.current.value;
    if(!enteredPassword && !enteredemail && !enteredUsername ){
 setShowNoUsername(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Username is required</p>)
 setshowNoemail(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Email is required</p>)
 setshowNopassword(<p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700">Password is required</p>)
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
            <p className="text-red-600 text-sm mt-1">
              ❌ Passwords do not match
            </p>
          )}
        </div>

        {/* Sign up button */}
        <button
          type="submit"
          className="bg-secondary text-white p-2 rounded-md w-full mt-4 hover:bg-secondary/90 transition"
        >
          Sign Up
        </button>
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
