import React, { useState } from "react";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/users";
import TextInput from "../components/UserComponents/createUserComponents/TextInput";
import PasswordInput from "../components/userComponents/createUserComponents/PasswordInput";

export default function SignUpForm({ changeToSignIn }) {
  const [formData, setFormData] = useState({
    user_firstname: "",
    user_lastname: "",
    user_email: "",
    user_phone: "",
    user_address: "",
    user_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const sanitizeInput = (value) => {
    return DOMPurify.sanitize(value.trim());
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizeInput(value),
    }));
  };

  const validateForm = () => {
    const errors = {};

    // First Name validation
    if (!formData.user_firstname.trim()) {
      errors.user_firstname = "First name is required";
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.user_firstname)) {
      errors.user_firstname =
        "First name must be 2-30 characters and contain only letters";
    }

    // Last Name validation
    if (!formData.user_lastname.trim()) {
      errors.user_lastname = "Last name is required";
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.user_lastname)) {
      errors.user_lastname =
        "Last name must be 2-30 characters and contain only letters";
    }

    // Email validation
    if (!formData.user_email.trim()) {
      errors.user_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      errors.user_email = "Invalid email format";
    }

    // Phone validation
    if (!formData.user_phone.trim()) {
      errors.user_phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.user_phone)) {
      errors.user_phone = "Invalid phone number format";
    }

    // Address validation
    if (!formData.user_address.trim()) {
      errors.user_address = "Address is required";
    } else if (formData.user_address.length < 5) {
      errors.user_address = "Address must be at least 5 characters long";
    }

    // Password validation
    const letters = formData.user_password.match(/[a-zA-Z]/g) || [];
    const numbers = formData.user_password.match(/[0-9]/g) || [];

    if (formData.user_password.length < 6) {
      errors.user_password =
        "Password must be at least 6 characters long (3 numbers and 3 letters)";
    } else if (letters.length < 3 || numbers.length < 3) {
      errors.user_password =
        "Password must contain at least 3 letters and 3 numbers";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      setError("Please correct the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData);
      setSuccessMessage("Sign Up Successful! You can now sign in.");
      setFormData({
        user_firstname: "",
        user_lastname: "",
        user_email: "",
        user_phone: "",
        user_address: "",
        user_password: "",
      });
    } catch (err) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md bg-neutral px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 rounded-xl sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-base-100">Sign Up</h1>
          <p className="mt-2 text-base-100">Create an account to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <TextInput
            name="user_firstname"
            label="First Name"
            value={formData.user_firstname}
            onChange={(e) =>
              handleInputChange("user_firstname", e.target.value)
            }
            error={validationErrors.user_firstname}
          />
          <TextInput
            name="user_lastname"
            label="Last Name"
            value={formData.user_lastname}
            onChange={(e) => handleInputChange("user_lastname", e.target.value)}
            error={validationErrors.user_lastname}
          />
          <TextInput
            name="user_email"
            label="Email Address"
            value={formData.user_email}
            onChange={(e) => handleInputChange("user_email", e.target.value)}
            error={validationErrors.user_email}
          />
          <TextInput
            name="user_phone"
            label="Phone Number"
            value={formData.user_phone}
            onChange={(e) => handleInputChange("user_phone", e.target.value)}
            error={validationErrors.user_phone}
          />
          <TextInput
            name="user_address"
            label="Address"
            value={formData.user_address}
            onChange={(e) => handleInputChange("user_address", e.target.value)}
            error={validationErrors.user_address}
          />
          <PasswordInput
            name="user_password"
            label="Password"
            value={formData.user_password}
            onChange={(e) => handleInputChange("user_password", e.target.value)}
            error={validationErrors.user_password}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword((prev) => !prev)}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && (
            <div className="text-green-500 mt-2 flex flex-col gap-1">
              <p>{successMessage}</p>
              <button
                className="text-blue-500 underline"
                onClick={changeToSignIn}
              >
                Sign In Now
              </button>
            </div>
          )}
          <button
            type="submit"
            className={`w-full button-main-style text-base-100 mt-8 ${
              isLoading
                ? "disabled:bg-info disabled:text-gray-400 disabled:cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
