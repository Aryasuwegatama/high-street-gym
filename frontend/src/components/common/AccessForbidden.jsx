import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccessForbidden() {
  const navigate = useNavigate();

  return (
    <div className="">
      <div role="alert" className="alert alert-error text-center mt-12 w-fit">
        <div>
          <h1 className="text-4xl font-bold text-base-100">403</h1>
          <h1 className="text-3xl font-bold text-base-100">Access Forbidden</h1>
          <p className="text-lg font-semibold ">
            You do not have permission to view this page.
          </p>
          <button className="btn mt-4" onClick={() => navigate(-1)}>
            Back
          </button>
          <span> or </span>
          <button className="btn mt-4" onClick={() => navigate("/signin")}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
