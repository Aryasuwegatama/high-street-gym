import { API_URL } from "./api";

// Create a new club
export async function createClub(newClub, authToken) {
  const response = await fetch(`${API_URL}/clubs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(newClub),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// Get all clubs
export async function getAllClubs(authToken) {
  const response = await fetch(`${API_URL}/clubs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// Get a single club by ID
export async function getClubById(clubId, authToken) {
  const response = await fetch(`${API_URL}/clubs/${clubId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// Update a club by ID
export async function updateClub(clubId, updatedFields, authToken) {
  const response = await fetch(`${API_URL}/clubs/${clubId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(updatedFields),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}

// Delete a club by ID
export async function deleteClub(clubId, authToken) {
  const response = await fetch(`${API_URL}/clubs/${clubId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "An unknown error occurred.");
  }

  return result;
}
