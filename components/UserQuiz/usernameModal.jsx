import LockIcon from "../icons/lockicon";
import EyeIcon from "../icons/eyeicon";
import EyeOffIcon from "../icons/eyeofficon";
import UserIcon from "../icons/user";
import Spinner from "@/components/icons/spinner";

import { useState, useRef } from "react";
import { useRouter } from "next/router";

export default function UsernameModal(props) {
  const router = useRouter();

  // --- UI state ---
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- validation & feedback state (store text, not JSX) ---
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null); // true/false/null
  const [serverMsg, setServerMsg] = useState({ type: "", text: "" }); // {type: 'success'|'error', text: string}

  // --- refs (you can convert to controlled inputs later if you prefer) ---
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  // Regex: at least 8 chars, uppercase, lowercase, digit, special
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

  // Update match indicator as user types in either password box
  function checkPasswordMatch() {
    const pwd = passwordRef.current?.value || "";
    const confirm = confirmPasswordRef.current?.value || "";

    if (!confirm) {
      setPasswordMatch(null); // don't show match/mismatch until confirm has content
      return;
    }
    setPasswordMatch(pwd === confirm);
  }

  // Validate all fields. Returns true if valid; sets error states otherwise.
  function validate() {
    // Clear old messages
    setServerMsg({ type: "", text: "" });
    setUsernameError("");
    setPasswordError("");
    setConfirmError("");

    const username = usernameRef.current?.value?.trim() || "";
    const password = passwordRef.current?.value || "";
    const confirm = confirmPasswordRef.current?.value || "";

    let ok = true;

    // Username
    if (!username) {
      setUsernameError("Username is required");
      ok = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      ok = false;
    }

    // Password strength
    if (!password) {
      setPasswordError("Password is required");
      ok = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 chars and include uppercase, lowercase, a number, and a special character."
      );
      ok = false;
    }

    // Confirm password
    if (!confirm) {
      setConfirmError("Please confirm your password");
      ok = false;
    } else if (password !== confirm) {
      setConfirmError("Confirm password does not match");
      ok = false;
    }

    // Visual live indicator
    setPasswordMatch(confirm ? password === confirm : null);

    return ok;
  }

  async function submitHandler(e) {
    e.preventDefault();

    // 1) Validate first. If not valid, show errors and DO NOT show loading.
    const valid = validate();
    if (!valid) return;

    // 2) Only now show loading & hit API
    setLoading(true);
    setServerMsg({ type: "", text: "" });

    try {
      const data = {
        fullname: "nofullname",
        username: usernameRef.current.value.trim(),
        email: "noemail@gmail.com",
        password: passwordRef.current.value,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerMsg({ type: "error", text: json?.message || "Registration failed" });
        setLoading(false);
        return;
      }

      setServerMsg({ type: "success", text: json?.message || "Registration successful" });

      // optional delay to let user see success message
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setServerMsg({ type: "error", text: err?.message || "Network error" });
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h1 className="text-xl font-bold text-center mb-5">Sign Up</h1>
        <p className="text-center text-gray-600">
          This will be your quiz identity. Choose wisely, you can&apos;t change it later.
        </p>

        <form onSubmit={submitHandler} noValidate>
          {/* Username */}
          <div className="mt-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <UserIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="username"
                ref={usernameRef}
                placeholder="Enter your username"
                className="pl-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                onChange={() => {
                  // live clear for UX
                  if (usernameError) setUsernameError("");
                }}
              />
            </div>
            {usernameError && (
              <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
                {usernameError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mt-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <LockIcon className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                ref={passwordRef}
                placeholder="Enter your password"
                className="pl-10 pr-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                onChange={() => {
                  // clear error as they type + update match
                  if (passwordError) setPasswordError("");
                  checkPasswordMatch();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
                {passwordError}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mt-5">
            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <LockIcon className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmpassword"
                ref={confirmPasswordRef}
                placeholder="Confirm your password"
                className="pl-10 pr-10 border border-gray-200 p-2 rounded-md bg-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                onChange={() => {
                  if (confirmError) setConfirmError("");
                  checkPasswordMatch();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Live match indicator */}
            {passwordMatch === true && (
              <p className="text-green-600 text-sm mt-1">✅ Passwords match</p>
            )}
            {passwordMatch === false && (
              <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
                ❌ Passwords do not match
              </p>
            )}
            {confirmError && (
              <p className="border-2 p-2 mt-2 rounded-2xl border-red-200 bg-red-100 text-red-700">
                {confirmError}
              </p>
            )}
          </div>

          {/* Submit / Cancel */}
          <div className="flex justify-around mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`p-2 rounded-md w-[150px] transition flex items-center justify-center 
                ${loading ? "bg-secondary/70 cursor-not-allowed" : "bg-secondary hover:bg-secondary/90 text-white"}`}
            >
              {loading ? <Spinner className="w-5 h-5" /> : "Continue"}
            </button>

            <button
              type="button"
              onClick={props.onClose}
              className="rounded-md pt-2 pb-2 text-blue-900 text-md border border-gray-400 w-[150px] hover:text-red-400 hover:border-red-400"
            >
              Cancel
            </button>
          </div>

          {/* Server messages */}
          {serverMsg.text && (
            <div
              className={`mt-4 border-2 p-2 rounded-2xl ${
                serverMsg.type === "success"
                  ? "border-green-200 bg-green-100 text-green-700"
                  : "border-red-200 bg-red-100 text-red-700"
              }`}
            >
              {serverMsg.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
