import React from "react";
import logo from "/logo-colored.png";

export default function AuthenticatingLoading() {
  return (
    <div className="flex justify-center item-center h-screen items-center bg-neutral">
      <div className="flex flex-col items-center">
        <img className="w-16 h-12" src={logo} alt="Logo" />
        <div className="flex pt-4">
          <span className="text-2xl font-bold text-info pr-1">
            Authenticating
          </span>
          <span className={`loading loading-dots loading-lg text-info`}></span>
        </div>
      </div>
    </div>
  );
}
