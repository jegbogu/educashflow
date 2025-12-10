import { useState, useRef } from "react";
import MailIcon from "@/components/icons/mailicon";
import { useRouter } from "next/router";
 
 
import Spinner from "@/components/icons/spinner";

export default function Register() {
 

  //after clicking on register
  const router = useRouter();
  const [finalReg, setFinalReg] = useState(null);
  const [loading, setLoading] = useState(false);

  //this is for all fields check, when a user clicks submit, it checks all the fields
  
  const [showNoemail, setshowNoemail] = useState(false);
  
  const emailRef = useRef();
 

  
  async function submitHandler(event) {
    setLoading(true);

    event.preventDefault();
  
    const enteredemail = emailRef.current.value;
   
    if (
     
      !enteredemail 
      
    ) {
       
      setshowNoemail(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
         text-red-700"
        >
          Email is required
        </p>
      );
      
    }

   
    //sending the data to the backend
    const data = {
      
      email: enteredemail,
    
    };

    const response = await fetch("/api/forgetPassword", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    let result = await response.json();

    if (!response.ok) {
      setFinalReg(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700"
        >
          {result.message}
        </p>
      );
      setLoading(false); // Reset if error
    } else {
      setFinalReg(
        <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
          {result.message}
        </p>
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push("/login");
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto border-4 border-gray-100 p-8 rounded-2xl mt-12 mb-10 bg-white shadow-md">
        {/* Header */}
        <h1 className="text-center p-2 text-2xl font-bold text-gray-800">
          Forget Password
        </h1>
        <p className="text-center">Password link expires in 15 minites</p>

        <form className="mt-6 space-y-5" onSubmit={submitHandler}>
          {/* Email */}
          
          
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

          

          {/* Sign up button */}
          <button
            type="submit"
            disabled={loading} // Prevent multiple clicks
            className={`p-2 rounded-md w-full mt-4 transition flex items-center justify-center 
        ${
          loading
            ? "bg-secondary/70 cursor-not-allowed"
            : "bg-secondary hover:bg-secondary/90 text-white"
        }`}
          >
            {loading ? (
              // Spinner
              <Spinner className="w-5 h-5" />
            ) : (
              "Request for password update link"
            )}
          </button>
          <div>{finalReg}</div>
        </form>

        
      </div>
    </div>
  );
}
