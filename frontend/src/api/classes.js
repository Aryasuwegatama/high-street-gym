import { API_URL } from "./api.js";
import { userIdTest } from "../user-session-sample.js";

export async function getAllClasses() {
    // GET all class timetable data 
    const response = await fetch(
        API_URL + '/classes',
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    const APIResponseObject = await response.json()
    // console.log(APIResponseObject)
    return APIResponseObject.data
}


export async function getClassesByClub(clubName) {
    try {
      // Encode the club name to handle spaces and special characters
      const encodedClubName = encodeURIComponent(clubName); 
  
      const response = await fetch(`${API_URL}/classes/club/${encodedClubName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      
      if (!response.ok) {
        // Check if it's a 404 error
        if (response.status === 404) {
          throw new Error(`No classes found for ${clubName}.`);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
  
      const data = await response.json();
      console.log(data.data)
      return data.data;
    } catch (error) {
      console.error("Error fetching classes by club:", error);
      throw error; 
    }
  }

  // get trainer availability
  export async function getTrainerAvailability(classId, trainerName) {
    const response = await fetch(`${API_URL}/classes/trainer-availability?classId=${classId}&trainerName=${encodeURIComponent(trainerName)}`);
    console.log(response)
    
    if (!response.ok) {
      throw new Error("Failed to fetch trainer availability");
    }
    
    const data = await response.json();
    return data;
  }
  

  // book a class with the selected trainer
  export async function bookClass(classId, trainerName) {
    const response = await fetch(`${API_URL}/classes/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId, trainerName, userId: userIdTest }),
    });
  
    if (response.status === 409) {
      const errorData = await response.json();
      return { success: false, message: errorData.message };
    }
  
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to book class." };
    }
  
    const data = await response.json();
    return { success: true, data };
  }
  

// API function to get user's booked classes
export async function getUserBookings(userId) {
  const response = await fetch(`${API_URL}/classes/bookings/user/${userId}`, 
    {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

// API function to cancel a booking
export async function cancelClassBooking(bookingId) {
  const response = await fetch(`${API_URL}/classes/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookingId })
  });

  if (!response.ok) {
    throw new Error("Failed to cancel booking");
  }

  const data = await response.json();
  return data;
}

// Function to remove booking
export async function deleteClassBooking(bookingId) {
  const response = await fetch(`${API_URL}/classes/booking/${bookingId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete booking.");
  }

  return await response.json();
}
