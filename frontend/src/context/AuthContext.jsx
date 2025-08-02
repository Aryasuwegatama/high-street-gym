// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  signIn as apiSignIn,
  signOut as apiSignOut,
  getUserByAuthToken,
} from "../api/users";
import AuthenticatingLoading from "../components/common/AuthLoading";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      getUserByAuthToken(token)
        .then((user) => {
          setAuthenticatedUser(user);
          setAuthToken(token);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load user:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (userEmail, userPassword) => {
    try {
      const result = await apiSignIn(userEmail, userPassword);
      localStorage.setItem("authToken", result.authToken);
      const user = await getUserByAuthToken(result.authToken);
      setAuthenticatedUser(user);
      setAuthToken(result.authToken);
      return Promise.resolve(result.message);
    } catch (error) {
      console.error("Sign in failed:", error);
      if (error.message === "User not found.") {
        return Promise.reject("user not found");
      }
      else if (error.message === "Invalid email or password") {
        return Promise.reject("invalid input");
      }
      return Promise.reject(
        error.message || "Sign in failed. Please try again."
      );
    }
  };

  const signOut = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await apiSignOut(token);
        localStorage.removeItem("authToken");
        setAuthenticatedUser(null);
        setAuthToken(null);
      } catch (error) {
        console.error("Sign out failed:", error);
      }
    }
  };

  if (loading) {
    console.log("Full page loading");
    return <AuthenticatingLoading />;
  }

  return (
    <AuthContext.Provider
      value={{ authenticatedUser, authToken, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
