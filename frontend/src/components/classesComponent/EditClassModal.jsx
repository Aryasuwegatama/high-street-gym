import React, { useState, useEffect } from "react";
import * as activitiesApi from "../../api/activities";
import { useAuth } from "../../context/AuthContext";

export default function EditClassModal({
  selectedClass: initialSelectedClass,
  handleCloseEditModal,
  handleSaveEdit,
}) {
  const [selectedClass, setSelectedClass] = useState(initialSelectedClass);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    setSelectedClass(initialSelectedClass);
  }, [initialSelectedClass]);

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

  const handleSave = async () => {
    setLoading(true);
    await handleSaveEdit(selectedClass);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    setSelectedClass({
      ...selectedClass,
      class_date: formattedDate,
    });
  };

  const handleActivityChange = (e) => {
    const selectedActivity = activities.find(activity => activity.activity_id === parseInt(e.target.value, 10));
    setSelectedClass({
      ...selectedClass,
      activity_id: selectedActivity.activity_id,
      activity_name: selectedActivity.activity_name,
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Class</h3>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class Activity
            </label>
            {loading ? (
              <p>Loading activities...</p>
            ) : (
              <select
                value={selectedClass.activity_id || ""}
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
            <input
              type="text"
              value={selectedClass.club_name || ""}
              onChange={(e) =>
                setSelectedClass({
                  ...selectedClass,
                  club_name: e.target.value,
                })
              }
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class Date
            </label>
            <input
              type="date"
              value={formatDate(selectedClass.class_date) || ""}
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
              value={selectedClass.class_time || ""}
              onChange={(e) =>
                setSelectedClass({
                  ...selectedClass,
                  class_time: e.target.value,
                })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="button-secondary-style"
              onClick={handleCloseEditModal}
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
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}