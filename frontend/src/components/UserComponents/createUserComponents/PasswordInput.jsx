import React from "react";
import { TbEye, TbEyeClosed } from "react-icons/tb";

export default function PasswordInput({
  name,
  label,
  value,
  onChange,
  error,
  showPassword,
  togglePasswordVisibility,
}) {
  return (
    <div className="relative mt-6">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        required
        className={`peer mt-1 w-full border-b-2 bg-neutral border-gray-300 px-0 py-1 text-base-100 placeholder-transparent focus:border-base-500 focus:outline-none ${
          error ? "border-red-500" : ""
        }`}
      />
      <label className="absolute left-0 top-0 -translate-y-2/3 transform text-sm text-base-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0">
        {label}
      </label>
      <button
        type="button"
        className="absolute right-3 top-2 flex items-center"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <TbEye className="text-gray-500 h-5 w-5" />
        ) : (
          <TbEyeClosed className="text-gray-500 h-5 w-5" />
        )}
      </button>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
