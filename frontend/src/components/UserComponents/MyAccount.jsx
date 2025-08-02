import React, { useState, useEffect } from "react";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { updateUserMember } from "../../api/users";
import DOMPurify from "dompurify";

export default function MyAccount() {
  const { authenticatedUser } = useAuth();
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

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.user) {
      const userData = authenticatedUser.user;
      setFormData({
        user_firstname: userData.user_firstname || "",
        user_lastname: userData.user_lastname || "",
        user_email: userData.user_email || "",
        user_phone: userData.user_phone || "",
        user_address: userData.user_address || "",
        user_password: "", // Password field should always be empty initially
      });
    }
  }, [authenticatedUser]);

  // Validation rules
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

    // Password validation (only if provided)
    if (formData.user_password) {
      const letters = formData.user_password.match(/[a-zA-Z]/g) || [];
      const numbers = formData.user_password.match(/[0-9]/g) || [];

      if (formData.user_password.length < 6) {
        errors.user_password =
          "Password must be at least 6 characters long (3 numbers and 3 letters)";
      } else if (letters.length < 3 || numbers.length < 3) {
        errors.user_password =
          "Password must contain at least 3 letters and 3 numbers";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Sanitize input data
  const sanitizeInput = (value) => {
    return DOMPurify.sanitize(value.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear validation error when user starts typing
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));

    // Sanitize input before setting state
    const sanitizedValue =
      name === "user_password" ? value : sanitizeInput(value);
    setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Update button clicked"); // Debugging statement
    setError(null);
    setSuccessMessage(null);

    // Validate form
    if (!validateForm()) {
      setError("Please correct the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // Only include password in update if it was changed
      const updateData = { ...formData };
      if (!updateData.user_password) {
        delete updateData.user_password;
      }

      const authToken = localStorage.getItem("authToken");
      // console.log("Making API call with data:", updateData); 
      const response = await updateUserMember(
        authenticatedUser.user.user_id,
        updateData,
        authToken
      );

      // Ensure response is logged
      // console.log(response);

      if (response.status === 200) {
        setSuccessMessage("Details updated successfully!");
        setFormData((prev) => ({ ...prev, user_password: "" })); // Clear password field after successful update
      } else {
        const errorMessage =
          response.message || "Failed to update details. Please try again.";
        setError(errorMessage);
        if (errorMessage === "User updated successfully.") {
          setSuccessMessage(errorMessage);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to update details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md bg-neutral px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 rounded-xl sm:px-10 mb-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-base-100">My Account</h1>
          <p className="mt-2 text-base-100">Update your account details</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative mt-6">
              <input
                type="text"
                name="user_firstname"
                placeholder="First Name"
                value={formData.user_firstname}
                onChange={handleChange}
                required
                className={`peer mt-1 w-full border-b-2 bg-neutral border-gray-300 px-0 py-1 text-base-100 placeholder-transparent focus:border-base-500 focus:outline-none ${
                  validationErrors.user_firstname ? "border-red-500" : ""
                }`}
              />
              <label className="absolute left-0 top-0 -translate-y-2/3 transform text-sm text-base-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0">
                First Name
              </label>
              {validationErrors.user_firstname && (
                <span className="text-red-500 text-xs mt-1">
                  {validationErrors.user_firstname}
                </span>
              )}
            </div>
            <div className="relative mt-6">
              <input
                type="text"
                name="user_lastname"
                placeholder="Last Name"
                value={formData.user_lastname}
                onChange={handleChange}
                required
                className={`peer mt-1 w-full border-b-2 bg-neutral border-gray-300 px-0 py-1 text-base-100 placeholder-transparent focus:border-base-500 focus:outline-none ${
                  validationErrors.user_lastname ? "border-red-500" : ""
                }`}
              />
              <label className="absolute left-0 top-0 -translate-y-2/3 transform text-sm text-base-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0">
                Last Name
              </label>
              {validationErrors.user_lastname && (
                <span className="text-red-500 text-xs mt-1">
                  {validationErrors.user_lastname}
                </span>
              )}
            </div>
          </div>
          <div className="relative mt-6">
            <input
              type="email"
              name="user_email"
              placeholder="Email Address"
              value={formData.user_email}
              onChange={handleChange}
              required
              className={`peer mt-1 w-full border-b-2 bg-neutral border-gray-300 px-0 py-1 text-base-100 placeholder-transparent focus:border-base-500 focus:outline-none ${
                validationErrors.user_email ? "border-red-500" : ""
              }`}
            />
            <label className="absolute left-0 top-0 -translate-y-2/3 transform text-sm text-base-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0">
              Email Address
            </label>
            {validationErrors.user_email && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.user_email}
              </span>
            )}
          </div>
          <div className="relative mt-6">
            <input
              type="tel"
              name="user_phone"
              placeholder="Phone Number"
              value={formData.user_phone}
              onChange={handleChange}
              required
              className={`peer mt-1 w-full border-b-2 bg-neutral border-gray-300 px-0 py-1 text-base-100 placeholder-transparent focus:border-base-500 focus:outline-none ${
                validationErrors.user_phone ? "border-red-500" : ""
              }`}
            />
            <label className="absolute left-0 top-0 -translate-y-2/3 transform text-sm text-base-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0">
              Phone Number
            </label>
            {validationErrors.user_phone && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.user_phone}
              </span>
            )}
          </div>
          <div className="relative mt-6">
            <input
              type="text"
              name="user_address"
              placeholder="Address"
              value={formData.user_address}
              onChange={handleChange}
              required
              className={`peer mt-1 w-full border-b-2 bg-neutral border-gray-300 px-0 py-1 text-base-100 placeholder-transparent focus:border-base-500 focus:outline-none ${
                validationErrors.user_address ? "border-red-500" : ""
              }`}
            />
            <label className="absolute left-0 top-0 -translate-y-2/3 transform text-sm text-base-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0">
              Address
            </label>
            {validationErrors.user_address && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.user_address}
              </span>
            )}
          </div>
          <div className="relative mt-6">
            <input
              type={showPassword ? "text" : "password"}
              name="user_password"
              placeholder="Password"
              value={formData.user_password}
              onChange={handleChange}
              className={`peer mt-1 w-full border-b-2 bg-neutral border-gray-300 px-0 py-1 text-base-100 placeholder-transparent focus:border-base-500 focus:outline-none ${
                validationErrors.user_password ? "border-red-500" : ""
              }`}
            />
            <label className="absolute left-0 top-0 -translate-y-2/3 transform text-sm text-base-100 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 peer-focus:top-0">
              Password
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
            {validationErrors.user_password && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.user_password}
              </span>
            )}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="my-6">
            <button
              type="submit"
              className={`w-full button-main-style text-base-100  ${
                isLoading
                  ? "disabled:bg-info disabled:text-gray-400 disabled:cursor-not-allowed"
                  : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Details"}
            </button>
          </div>
          {successMessage && (
            <div className="flex flex-col items-center mt-2">
              <p className="text-green-500">{successMessage}</p>
              <button
                onClick={() => window.location.reload()}
                className="ml-4 text-blue-500 underline"
              >
                Refresh to apply changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
