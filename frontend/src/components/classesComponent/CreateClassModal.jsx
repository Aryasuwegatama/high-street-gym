import React, { useState, useEffect } from "react";
import * as activitiesApi from "../../api/activities";
import * as clubsApi from "../../api/clubs";
import { useAuth } from "../../context/AuthContext";

export default function CreateClassModal({
  handleCloseCreateModal,
  handleSaveCreate,
}) {
  const [newClass, setNewClass] = useState({
    activity_id: "",
    club_id: "",
    class_date: "",
    class_time: "",
  });
  const [activities, setActivities] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await activitiesApi.getAllActivities(authToken);
        setActivities(data.activities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [authToken]);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const data = await clubsApi.getAllClubs(authToken);
        setClubs(data.clubs);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, [authToken]);

  const handleSave = async () => {
    if (!newClass.activity_id || !newClass.club_id || !newClass.class_date || !newClass.class_time) {
      setValidationMessage("Please fill in all fields before submitting.");
      return;
    }
    setLoading(true);
    await handleSaveCreate(newClass);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    setNewClass({
      ...newClass,
      class_date: formattedDate,
    });
  };

  const handleActivityChange = (e) => {
    const selectedActivity = activities.find(activity => activity.activity_id === parseInt(e.target.value, 10));
    setNewClass({
      ...newClass,
      activity_id: selectedActivity.activity_id,
      activity_name: selectedActivity.activity_name,
    });
  };

  const handleClubChange = (e) => {
    const selectedClub = clubs.find(club => club.club_id === parseInt(e.target.value, 10));
    setNewClass({
      ...newClass,
      club_id: selectedClub.club_id,
      club_name: selectedClub.club_name,
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create Class</h3>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class Activity
            </label>
            {loading ? (
              <p>Loading activities...</p>
            ) : (
              <select
                value={newClass.activity_id || ""}
                onChange={handleActivityChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" disabled>Select an activity</option>
                {activities.map((activity) => (
                  <option key={activity.activity_id} value={activity.activity_id}>
                    {activity.activity_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Name
            </label>
            {loading ? (
              <p>Loading clubs...</p>
            ) : (
              <select
                value={newClass.club_id || ""}
                onChange={handleClubChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="" disabled>Select a club</option>
                {clubs.map((club) => (
                  <option key={club.club_id} value={club.club_id}>
                    {club.club_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class Date
            </label>
            <input
              type="date"
              value={formatDate(newClass.class_date) || ""}
              onChange={handleDateChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class Time
            </label>
            <input
              type="time"
              value={newClass.class_time || ""}
              onChange={(e) =>
                setNewClass({
                  ...newClass,
                  class_time: e.target.value,
                })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {validationMessage && (
          <div className="text-error">
            <span>{validationMessage}</span>
          </div>
        )}
          <div className="modal-action">
            <button
              type="button"
              className="button-secondary-style"
              onClick={handleCloseCreateModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-main-style"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}