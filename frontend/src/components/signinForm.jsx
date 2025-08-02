import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { useAuth } from "../context/AuthContext";

export default function SignIn({ changeToSignUp }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    return letterCount >= 3 && numberCount >= 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must contain at least 3 letters and 3 numbers."
      );
      return;
    }

    try {
      setIsLoading(true);
      await Promise.resolve(setTimeout(() => {}, 1000));
      await signIn(email, password);
      navigate("/home");
    } catch (err) {
      console.log(err);
      console.error("Sign-in failed:", err);
      console.error(err);
      if (
        err ===
        "user not found"
      ) {
        setError(
          "Email is not signed up. Please sign up or check your email again."
        );
      } else if (err === "invalid input") {
        setError(
          "Incorrect Email or Password."
        );
      } else {
        setError(err.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md bg-neutral px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 rounded-xl sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-base-100">Sign in</h1>
          <p className="mt-2 text-base-100">
            Sign in below to access your account
          </p>
        </div>
        <div className="mt-5">
          <form onSubmit={handleSubmit}>
            <div className="relative mt-6">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                className={`peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral ${emailError && "border-red-500"}`}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
              >
                Email Address
              </label>
            </div>
            {emailError && <p className="text-red-500 mt-1">{emailError}</p>}

            <div className="relative mt-6">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className={`peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral ${passwordError && "border-red-500"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="password"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
              >
                Password
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center px-2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <TbEye className="text-gray-500 h-5 w-5" />
                ) : (
                  <TbEyeClosed className="text-gray-500 h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 mt-1">{passwordError}</p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="my-6">
              <button
                type="submit"
                className={`w-full button-main-style text-base-100 ${
                  isLoading
                    ? "disabled:bg-info disabled:text-gray-400 disabled:cursor-not-allowed"
                    : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Don&#x27;t have an account yet?{" "}
              <span
                onClick={changeToSignUp}
                className="font-semibold text-info hover:underline hover:text-accent focus:text-accent focus:outline-none cursor-pointer"
              >
                Sign Up
              </span>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
