import React from "react";

export default function TextInput({ name, label, value, onChange, error }) {
  return (
    <div className="relative mt-6">
      <input
        type="text"
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
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
