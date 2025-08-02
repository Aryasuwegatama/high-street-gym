import React from "react";

export default function LoadingSpinner({ size = "lg", color = "info" }) {
  return (
    <div className="flex justify-center item-center">
      <span
        className={`loading loading-spinner loading-${size} text-${color}`}
      ></span>
    </div>
  );
}
