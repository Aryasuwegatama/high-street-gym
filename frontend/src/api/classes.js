import { API_URL } from "./api.js";

// Classes API functions
export async function getAllClasses(token) {
  const response = await fetch(API_URL + "/classes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: token,
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.data;
}

export async function getClassesByClub(clubName, token) {
  try {
    const encodedClubName = encodeURIComponent(clubName);
    const response = await fetch(`${API_URL}/classes/club/${encodedClubName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authToken: token,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No classes found for ${clubName}.`);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching classes by club:", error);
    throw error;
  }
}

export async function getTrainerAvailability(classId, trainerName, token) {
  const response = await fetch(
    `${API_URL}/classes/trainer-availability?classId=${classId}&trainerName=${encodeURIComponent(trainerName)}`,
    {
      headers: {
        authToken: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trainer availability");
  }

  const data = await response.json();
  return data;
}

export async function updateClass(classId, classData, authToken) {
  const response = await fetch(`${API_URL}/classes/${classId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(classData),
  });

  const result = await response.json();
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`No classes found for the given ID.`);
    } else if (response.status === 409) {
      throw new Error(result.message);
    } else {
      throw new Error(`Failed to update class, Status: ${response.status}`);
    }
  }

  return result;
}

export async function createClass(classData, authToken) {
  const response = await fetch(`${API_URL}/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    
    throw new Error("Failed to create class");
  }

  return await response.json();
}

export async function deleteClass(classId, authToken) {
  const response = await fetch(`${API_URL}/classes/${classId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete class");
  }

  return await response.json();
}

export async function checkClassBookings(classId, authToken) {
  const response = await fetch(`${API_URL}/classes/${classId}/bookings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to check class bookings");
  }

  return await response.json();
}

export async function deleteClassBookings(classId, authToken) {
  const response = await fetch(`${API_URL}/classes/${classId}/bookings`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete class bookings");
  }

  return await response.json();
}
