import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/users";
import {
  getAllActivities,
  assignTrainerToActivity,
} from "../../api/activities";
import { getAllClubs } from "../../api/clubs";
import TextInput from "./createUserComponents/TextInput";
import PasswordInput from "../userComponents/createUserComponents/PasswordInput";
import SelectInput from "./createUserComponents/SelectInput";
import TrainerSpecificFields from "./createUserComponents/TrainerSpecificFields";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    user_firstname: "",
    user_lastname: "",
    user_email: "",
    user_phone: "",
    user_address: "",
    user_password: "",
    user_role: "member",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const activitiesData = await getAllActivities(authToken);
        setActivities(activitiesData.activities);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const clubsData = await getAllClubs(authToken);
        console.log(clubsData);
        setClubs(clubsData.clubs);
      } catch (error) {
        console.error("Failed to fetch clubs", error);
      }
    };
    fetchClubs();
  }, []);

  // Sanitization function
  const sanitizeInput = (value) => {
    return DOMPurify.sanitize(value.trim());
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizeInput(value),
    }));
  };

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

    // Trainer-specific validation
    if (formData.user_role === "trainer") {
      if (!selectedActivities.length) {
        errors.activities = "At least one activity must be selected";
      }
      if (!selectedClub) {
        errors.club_id = "A club must be selected";
      }
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
      const authToken = localStorage.getItem("authToken");
      const createdUser = await createUser(formData, authToken);
      console.log("Created User:", createdUser);

      if (formData.user_role === "trainer") {
        const userId = createdUser.userId;

        console.log("User ID:", userId);
        console.log("Selected Activities:", selectedActivities);
        console.log("Selected Club:", selectedClub);
        for (const activityId of selectedActivities) {
          console.log("Assigning activity:", activityId);
          await assignTrainerToActivity(
            userId,
            activityId,
            selectedClub,
            authToken
          );
        }
      }

      setSuccessMessage("User created successfully!");
      setFormData({
        user_firstname: "",
        user_lastname: "",
        user_email: "",
        user_phone: "",
        user_address: "",
        user_password: "",
        user_role: "member",
      });
      setSelectedActivities([]);
      setSelectedClub("");
    } catch (err) {
      setError(err.message || "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md bg-neutral px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 rounded-xl sm:px-10 mb-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-base-100">
            Create New User
          </h1>
          <p className="mt-2 text-base-100">
            Fill in the details to create a new user
          </p>
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
          <SelectInput
            name="user_role"
            label="User Role"
            value={formData.user_role}
            options={[
              { value: "member", label: "Member" },
              { value: "trainer", label: "Trainer" },
              { value: "admin", label: "Admin" },
            ]}
            onChange={(e) => handleInputChange("user_role", e.target.value)}
          />

          {formData.user_role === "trainer" && (
            <TrainerSpecificFields
              activities={activities}
              clubs={clubs}
              selectedActivities={selectedActivities}
              setSelectedActivities={setSelectedActivities}
              selectedClub={selectedClub}
              setSelectedClub={setSelectedClub}
              validationErrors={validationErrors}
            />
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            type="submit"
            className={`w-full button-main-style text-base-100 mt-8 ${
              isLoading
                ? "disabled:bg-info disabled:text-gray-400 disabled:cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create User"}
          </button>
          {successMessage && (
            <div className="flex flex-col items-center mt-2">
              <p className="text-green-500">{successMessage}</p>
              <button
                onClick={() => navigate("/manage-users")}
                className="ml-4 text-blue-500 underline"
              >
                Go to Manage Users
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
