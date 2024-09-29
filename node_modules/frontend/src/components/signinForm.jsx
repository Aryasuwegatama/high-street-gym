import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TbEye, TbEyeClosed } from "react-icons/tb";


export default function SignIn({ changeToSignUp }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div class="relative mx-auto w-full max-w-md bg-neutral px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 rounded-xl sm:px-10">
      <div class="w-full">
        <div class="text-center">
          <h1 class="text-3xl font-semibold text-base-100">Sign in</h1>
          <p class="mt-2 text-base-100">Sign In below to access your account</p>
        </div>
        <div class="mt-5">
          <form action="">
            <div class="relative mt-6 ">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                class="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
                autocomplete="NA"
              />
              <label
                for="email"
                class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
              >
                Email Address
              </label>
            </div>
            <div class="relative mt-6">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                class="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
              />
              <label
                for="password"
                class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
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
            <div class="my-6">
              <Link
                // type="submit"
                to={"/home"}
                class="w-full btn btn-primary hover:bg-secondary px-8 focus:outline focus:bg-secondary focus:shadow-outline text-lg rounded-full"
              >
                Sign In
              </Link>
            </div>
            <p class="text-center text-sm text-gray-500">
              Don&#x27;t have an account yet?
              <span
                onClick={changeToSignUp}
                class="font-semibold text-info hover:underline hover:text-accent focus:text-accent focus:outline-none"
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
