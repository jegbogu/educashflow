import { useState, useRef } from "react";
import MailIcon from "@/components/icons/mailicon";
import { useRouter } from "next/router";
import UserIcon from "@/components/icons/user";
import LockIcon from "@/components/icons/lockicon";

import Link from "next/link";
import Spinner from "@/components/icons/spinner";
import RootLayout from "@/components/layout";

export default function Adminregeducashflow() {
  //after clicking on register
  const router = useRouter();
  const [finalReg, setFinalReg] = useState(null);
  const [loading, setLoading] = useState(false);

  //this is for all fields check, when a user clicks submit, it checks all the fields

  const [showNoemail, setshowNoemail] = useState(false);

  const [showNofullname, setshowNofullname] = useState(false);

  const emailRef = useRef();
  const fullnameRef = useRef();

  async function submitHandler(event) {
    setLoading(true);

    event.preventDefault();

    const enteredemail = emailRef.current.value;

    const enteredfullname = fullnameRef.current.value;
    if (!enteredemail && !enteredfullname) {
      setshowNofullname(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700"
        >
          Fullname is required
        </p>
      );

      setshowNoemail(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700"
        >
          Email is required
        </p>
      );
    }

    //this is for fullname
    if (enteredfullname.trim().length < 5) {
      setshowNofullname(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700"
        >
          Fullname must be more than 5 characters
        </p>
      );
    } else {
      setshowNofullname(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100
text-green-700"
        >
          Correct Fullname
        </p>
      );
    }

    // this is for email
    if (enteredemail.trim().length < 5) {
      setshowNoemail(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700"
        >
          Email must be more than 5 characters
        </p>
      );
    } else {
      setshowNoemail(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100
text-green-700"
        >
          Correct Email{" "}
        </p>
      );
    }

    // Define the regex once
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    //sending the data to the backend
    const data = {
      fullname: enteredfullname,

      email: enteredemail,
    };

    const response = await fetch("/api/admin-register", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    let newPostData = await response.json();

    if (!response.ok) {
      setFinalReg(
        <p
          className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100
text-red-700"
        >
          {newPostData.message}
        </p>
      );
      setLoading(false); // Reset if error
    } else {
      setFinalReg(
        <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
          {newPostData.message}
        </p>
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push("/adminlogin");
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto border-4 border-gray-100 p-8 rounded-2xl mt-12 mb-10 bg-white shadow-md">
        {/* Header */}
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Admin Sign Up
        </h1>

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
            <Link href="/adminlogin">Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

Adminregeducashflow.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
