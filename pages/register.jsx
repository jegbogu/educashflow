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
  const [agreement, setAgreement] = useState(false);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showNoUsername, setShowNoUsername] = useState(false);
  const [showNoemail, setshowNoemail] = useState(false);
  const [showNopassword, setshowNopassword] = useState(false);
  const [showNofullname, setshowNofullname] = useState(false);

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const fullnameRef = useRef();

  // ALERT STATES
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [afterOkAction, setAfterOkAction] = useState(null);

  function showCustomAlert(message, action = null) {
    setAlertMessage(message);
    setAfterOkAction(() => action);
    setShowAlert(true);
  }

  function checkPassword() {
    const enteredPassword = passwordRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current.value;

    if (!enteredConfirmPassword) {
      setPasswordMatch(null);
    } else if (enteredConfirmPassword === enteredPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }

  async function submitHandler(event) {
    setLoading(true);
    event.preventDefault();

    const enteredPassword = passwordRef.current.value;
    const enteredemail = emailRef.current.value;
    const enteredUsername = usernameRef.current.value;
    const enteredfullname = fullnameRef.current.value;

    if (
      !enteredPassword &&
      !enteredemail &&
      !enteredUsername &&
      !enteredfullname
    ) {
      setshowNofullname(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Fullname is required
        </p>
      );
      setShowNoUsername(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Username is required
        </p>
      );
      setshowNoemail(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Email is required
        </p>
      );
      setshowNopassword(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Password is required
        </p>
      );
    }

    if (enteredfullname.trim().length < 5) {
      setshowNofullname(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Fullname must be more than 5 characters
        </p>
      );
    } else {
      setshowNofullname(
        <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
          Correct Fullname
        </p>
      );
    }

    if (enteredUsername.trim().length < 3) {
      setShowNoUsername(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Username must be more than 3 characters
        </p>
      );
    } else {
      setShowNoUsername(
        <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
          Correct Username
        </p>
      );
    }

    if (enteredemail.trim().length < 5) {
      setshowNoemail(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Email must be more than 5 characters
        </p>
      );
    } else {
      setshowNoemail(
        <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
          Correct Email
        </p>
      );
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!passwordRegex.test(enteredPassword)) {
      setshowNopassword(
        <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
          Password must be at least 8 characters long, and include an uppercase,
          a lowercase, a number, and a special character.
        </p>
      );
    } else {
      setshowNopassword(
        <p className="border-2 p-2 mt-2 rounded-2xl border-green-200 bg-green-100 text-green-700">
          Correct Password
        </p>
      );
    }

    const data = {
      fullname: enteredfullname,
      username: enteredUsername,
      email: enteredemail,
      password: enteredPassword,
      agreement: agreement,
    };

    const response = await fetch("/api/register", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    let newPostData = await response.json();

    if (!response.ok) {
      showCustomAlert(newPostData.message || "Something went wrong");
      setLoading(false);
    } else {
      showCustomAlert(newPostData.message, () => {
        router.push("/login");
      });
    }
  }

  return (
    <div className="p-6">
      <Link
        href="/"
        className="inline-flex items-center text-secondary p-2 rounded-md hover:bg-gray-50 transition"
      >
        ← Home
      </Link>

      <div className="max-w-xl mx-auto border-4 border-gray-100 p-8 rounded-2xl mt-12 mb-10 bg-white shadow-md">
        <h1 className="text-center p-2 text-2xl font-bold text-gray-800">
          Sign Up
        </h1>

        <form className="mt-6 space-y-5" onSubmit={submitHandler}>
          {/* Fullname */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <UserIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                ref={fullnameRef}
                placeholder="Enter your fullname"
                className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full"
              />
            </div>
            {showNofullname}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <UserIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                ref={usernameRef}
                placeholder="Enter your username"
                className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full"
              />
            </div>
            {showNoUsername}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <MailIcon className="w-5 h-5" />
              </span>
              <input
                type="email"
                ref={emailRef}
                placeholder="Enter your email"
                className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full"
              />
            </div>
            {showNoemail}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <LockIcon className="w-5 h-5" />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                onChange={checkPassword}
                placeholder="Enter your password"
                className="pl-10 pr-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {showNopassword}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              ref={confirmPasswordRef}
              onChange={checkPassword}
              placeholder="Confirm your password"
              className="border border-gray-200 p-2 rounded-md bg-gray-100 w-full"
            />

            {passwordMatch === true && (
              <p className="text-green-600 text-sm mt-1">✅ Passwords match</p>
            )}
            {passwordMatch === false && (
              <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
                ❌ Passwords do not match
              </p>
            )}
          </div>

          {/* Agreement */}
          <div>
            <input
              type="checkbox"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
            />
            <span>
              {" "}
              I Agree with the{" "}
              <a
                href="/tosap"
                target="_blank"
                className="text-blue-500"
              >
                Terms of Service, Privacy Policy and Disclaimer
              </a>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`p-2 rounded-md w-full mt-4 flex justify-center ${
              loading
                ? "bg-secondary/70 cursor-not-allowed"
                : "bg-secondary text-white"
            }`}
          >
            {loading ? <Spinner className="w-5 h-5" /> : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center mt-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex justify-center">
          <button className="w-full bg-white text-secondary border-2 border-gray-200 p-2 rounded-md sm:w-1/2 mt-5 hover:bg-gray-50 hover:border-secondary transition">
            <Link href="/login">Login</Link>
          </button>
        </div>
      </div>

      {/* ALERT POPUP */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <p className="mb-6 text-gray-800">{alertMessage}</p>

            <button
              onClick={async () => {
                setShowAlert(false);
                if (afterOkAction) {
                  await afterOkAction();
                }
              }}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-white hover:text-secondary border border-secondary transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}