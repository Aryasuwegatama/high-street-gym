import { API_URL } from "./api.js";

// Bookings API functions
export async function bookClass(classId, trainerName, userId, token) {
  const response = await fetch(`${API_URL}/bookings/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: token,
    },
    body: JSON.stringify({
      classId,
      trainerName,
      userId,
    }),
  });

  if (response.status === 409) {
    const errorData = await response.json();
    return { success: false, message: errorData.message };
  }

  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      message: errorData.message || "Failed to book class.",
    };
  }

  const data = await response.json();
  return { success: true, data };
}

export async function getUserBookings(userId, token) {
  const response = await fetch(`${API_URL}/bookings/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: token,
    },
  });

  if (response.status === 404) {
    throw new Error("You don't have any bookings");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user bookings");
  }

  const data = await response.json();
  return data.data;
}

export async function cancelClassBooking(bookingId, token) {
  const response = await fetch(`${API_URL}/bookings/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: token,
    },
    body: JSON.stringify({ bookingId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to cancel booking");
  }

  const data = await response.json();
  return data;
}

export async function deleteClassBooking(bookingId, token) {
  const response = await fetch(`${API_URL}/bookings/booking/${bookingId}`, {
    method: "DELETE",
    headers: {
      authToken: token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete booking.");
  }

  return await response.json();
}

export async function deleteAllUserBookings(userId, token) {
  const response = await fetch(`${API_URL}/bookings/user-bookings/${userId}`, {
    method: "DELETE",
    headers: {
      authToken: token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete all bookings.");
  }

  return await response.json();
}

export async function getAllBookings(token) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: token,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch all bookings");
  }

  const data = await response.json();
  return data.data;
}
