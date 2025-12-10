import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import passwordresetinfo from "../passwordresetInfo.json";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  // Token and user information
  const [userToken, setUserToken] = useState(null);
  const [userID, setUserID] = useState(null);

  // Password inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Validation State
  const [validationState, setValidationState] = useState("loading");

  // Password strength
  const [strength, setStrength] = useState(0);

  // ---------------------------------------------
  // Extract token and user ID
  // ---------------------------------------------
  useEffect(() => {
    if (!token) return;

    if (!token.includes("-")) {
      setValidationState("invalid");
      return;
    }

    const [tok, uid] = token.split("-");
    setUserToken(tok);
    setUserID(uid);
  }, [token]);

  // ---------------------------------------------
  // Validate token + user existence
  // ---------------------------------------------
  useEffect(() => {
    if (!userID || !userToken) return;

    const user = passwordresetinfo.find((el) => el.userID === userID);
    const tokenData = passwordresetinfo.find((el) => el.token === userToken);

    if (!user || !tokenData) {
      setValidationState("invalid");
      return;
    }

    if (Date.now() > tokenData.expiresAt) {
      setValidationState("expired");
      return;
    }

    setValidationState("valid");
  }, [userID, userToken]);

  // ---------------------------------------------
  // Password rules
  // ---------------------------------------------
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  useEffect(() => {
    setStrength(Object.values(rules).filter(Boolean).length);
  }, [password]);

  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
  ];

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-600",
  ];

  const safeStrength = Math.min(strength, 4);

  // ---------------------------------------------
  // Submit Handler
  // ---------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (strength < 4) {
      setErrorMsg("Password is too weak");
      return;
    }

    setLoading(true);

    const datadd =  {
        userID:userID,
        newPassword: password,
        invalidateSessions: true,
      }
   
    const res = await fetch("/api/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datadd),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.message || "Something went wrong");
      setLoading(false);
      return;
    }

    setSuccessMsg("Password reset successful! Redirecting...");
    setTimeout(() => router.push("/login"), 1500);
  };

  // ---------------------------------------------
  // Render Validation States
  // ---------------------------------------------
  if (validationState === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (validationState === "invalid") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold">
          Invalid or malformed reset link.
        </p>
      </div>
    );
  }

  if (validationState === "expired") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold">
          This reset link has expired.
        </p>
      </div>
    );
  }

  // ---------------------------------------------
  // MAIN FORM
  // ---------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-6 text-center">Reset Your Password</h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
            {successMsg}
          </div>
        )}

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border rounded-lg pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
            </span>
          </div>
        </div>

        {/* Strength Bar */}
        {password && (
          <div className="mb-4">
            <div className="h-2 rounded bg-gray-200">
              <div
                className={`h-full rounded transition-all ${strengthColors[safeStrength]}`}
                style={{ width: `${(safeStrength / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1 text-gray-600">Strength: {strengthLabels[safeStrength]}</p>
          </div>
        )}

        {/* Requirements */}
        <div className="mb-6 bg-gray-50 p-3 border rounded-lg">
          <p className="font-semibold mb-2">Password must contain:</p>

          {[
            ["At least 8 characters", rules.length],
            ["Uppercase letter (A-Z)", rules.upper],
            ["Lowercase letter (a-z)", rules.lower],
            ["Number (0-9)", rules.number],
            ["Symbol (!@#$%)", rules.symbol],
          ].map(([label, valid]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              {valid ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-500" />
              )}
              <span className={valid ? "text-green-700" : "text-gray-600"}>{label}</span>
            </div>
          ))}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full p-3 border rounded-lg pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
