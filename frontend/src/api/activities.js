import { API_URL } from "./api";

// 1. Get trainer activities by trainer ID
export async function getTrainerActivities(id, token) {
  try {
    const response = await fetch(
      `${API_URL}/activities/trainer-activities/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken: token,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching trainer activities:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
}

// 2. Delete a trainer activity
export async function deleteTrainerActivity(userId, activityId, token) {
  try {
    const response = await fetch(
      `${API_URL}/activities/delete-activity/${userId}/${activityId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authToken: token,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting trainer activity:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
}

// 3. Create a new activity
export async function createActivity(activity, token) {
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: token,
      },
      body: JSON.stringify(activity),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating activity:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
}

// 4. Get all activities
export async function getAllActivities(token) {
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authToken: token,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all activities:", error);
    throw error;
  }
}

// 5. Get an activity by ID
export const getActivityById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/activities/activity/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authToken: token,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    throw error;
  }
};

export const updateActivity = async (id, activity, token) => {
  try {
    const response = await fetch(
      `${API_URL}/activities/update-activity/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authToken: token,
        },
        body: JSON.stringify(activity),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
};

export const deleteActivityById = async (id, token) => {
  try {
    const response = await fetch(
      `${API_URL}/activities/delete-activity/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authToken: token,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting activity by ID:", error);
    throw error;
  }
};

// 6. Get all trainer activities
export async function getAllTrainerActivities(token) {
  try {
    const response = await fetch(
      `${API_URL}/activities/all-trainer-activities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken: token,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all trainer activities:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
}

// 7. Assign a trainer to an activity
export async function assignTrainerToActivity(
  trainerId,
  activityId,
  clubId,
  token
) {
  try {
    const response = await fetch(`${API_URL}/activities/assign-trainer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken: token,
      },
      body: JSON.stringify({ trainerId, activityId, clubId }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error assigning trainer to activity:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
}
