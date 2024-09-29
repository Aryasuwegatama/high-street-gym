import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TbEye, TbEyeClosed } from "react-icons/tb";

export default function SignUp({changeToSignIn}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative mx-auto w-full max-w-md bg-neutral px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 rounded-xl sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-base-100">Sign Up</h1>
          <p className="mt-2 text-base-100">
            Create an account to get started
          </p>
        </div>
        <div className="mt-5">
          <form action="">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative mt-6">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  className="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
                  autoComplete="given-name" 
                />
                <label
                  htmlFor="firstName"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
                >
                  First Name
                </label>
              </div>
              <div className="relative mt-6">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  className="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
                  autoComplete="family-name" 
                />
                <label
                  htmlFor="lastName"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
                >
                  Last Name
                </label>
              </div>
            </div>
            <div className="relative mt-6 ">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                className="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
                autoComplete="email" 
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
              >
                Email Address
              </label>
            </div>
            <div className="relative mt-6 ">
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Phone Number"
                className="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
                autoComplete="tel" 
              />
              <label
                htmlFor="phone"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
              >
                Phone Number
              </label>
            </div>
            <div className="relative mt-6 ">
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                className="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
                autoComplete="street-address" 
              />
              <label
                htmlFor="address"
                className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-2/3 transform text-sm text-base-100 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base-100 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-base-100"
              >
                Address
              </label>
            </div>
            <div className="relative mt-6">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className="peer mt-1 w-full border-b-2 text-base-100 bg-neutral border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-base-500 focus:outline-none focus:text-base-100 focus:bg-neutral"
                autoComplete="new-password" 
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
            <div className="my-6">
              <Link
                // type="submit"
                to ={"/home"}
                className="w-full btn btn-primary hover:bg-secondary px-8 focus:outline focus:bg-secondary focus:shadow-outline text-lg rounded-full"
              >
                Sign Up
              </Link>
            </div>
            <p class="text-center text-sm text-gray-500">
              Don&#x27;t have an account yet?
              <span
                onClick={changeToSignIn}
                class="font-semibold text-info hover:underline hover:text-accent focus:text-accent focus:outline-none"
              >
                Sign In
              </span>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
