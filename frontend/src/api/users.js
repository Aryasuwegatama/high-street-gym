import { API_URL } from "./api";

// 1. Sign in a user
export async function signIn(userEmail, userPassword) {
  const response = await fetch(`${API_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_email: userEmail,
      user_password: userPassword,
    }),
  });

  const result = await response.json();

  console.log(result);

  if (response.status === 404) {
    throw new Error("User not found.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// 2. Sign up a new member
export async function signUp(newUser) {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  const result = await response.json();

  if (response.status === 409) {
    throw new Error("User already exists.");
  } else if (response.status === 400) {
    throw new Error("Invalid user data. Please check the form.");
  } else if (response.status === 500) {
    throw new Error("Server error. Please try again.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// 3. Sign out a user
export async function signOut(authToken) {
  const response = await fetch(`${API_URL}/users/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();
  console.log(result);

  if (response.status === 401) {
    throw new Error("Unauthorized. Please sign in again.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

export async function getAllUsers(authToken) {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  if (response.status === 403) {
    throw new Error("Forbidden. You do not have access.");
  } else if (response.status === 500) {
    throw new Error("Server error. Please try again.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// 3. Get user by auth token
export async function getUserByAuthToken(authToken) {
  const response = await fetch(`${API_URL}/users/auth`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  // Handle different status codes from the backend
  if (response.status === 401) {
    throw new Error("Invalid token.");
  } else if (response.status === 404) {
    throw new Error("User not found.");
  } else if (response.status === 500) {
    throw new Error("Server error. Please try again.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}
// 5. Get user by ID
export async function getUserById(userId, authToken) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  if (response.status === 404) {
    throw new Error("User not found.");
  } else if (response.status === 401) {
    throw new Error("Unauthorized. Please sign in again.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// 7. Update a user's details my-account
export async function updateUserMember(userId, updatedFields, authToken) {
  const response = await fetch(`${API_URL}/users/update-my-account/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(updatedFields),
  });

  const result = await response.json();

  if (response.status === 404) {
    throw new Error("User not found.");
  } else if (response.status === 401) {
    throw new Error("Unauthorized. Please sign in.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// 6. Create a new user (Admin only)
export async function createUser(newUser, authToken) {
  const response = await fetch(`${API_URL}/users/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(newUser),
  });

  const result = await response.json();
  console.log(result);

  if (response.status === 409) {
    throw new Error("User already exists.");
  } else if (response.status === 401) {
    throw new Error("Unauthorized. Please sign in.");
  } else if (response.status === 400) {
    throw new Error("Invalid user data. " + result.errors);
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}


// 8. Delete a user by ID
export async function deleteUser(userId, authToken) {
  const response = await fetch(`${API_URL}/users/delete-user/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  return result;
}

// 9. Get user by email
export async function getUserByEmail(userEmail, authToken) {
  const response = await fetch(`${API_URL}/users/email/${userEmail}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  if (response.status === 404) {
    throw new Error("User not found.");
  } else if (response.status === 401) {
    throw new Error("Unauthorized. Please sign in again.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// 10. Update a user's details by admin
export async function updateUserAdmin(userId, updatedFields, authToken) {
  const response = await fetch(`${API_URL}/users/update-user/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(updatedFields),
  });

  const result = await response.json();

  if (response.status === 404) {
    throw new Error("User not found.");
  } else if (response.status === 401) {
    throw new Error("Unauthorized. Please sign in.");
  } else if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}
