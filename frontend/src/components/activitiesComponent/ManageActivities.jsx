import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as activitiesApi from "../../api/activities";
import XMLUploader from "../XML/XMLUploader";
import ResultModal from "../UserComponents/ResultModal";
import { useAuth } from "../../context/AuthContext";

export default function ManageActivities() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isXmlModalOpen, setIsXmlModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [resultModal, setResultModal] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    activityId: null,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { authToken, user } = useAuth();
  const [sortOrder, setSortOrder] = useState("latest");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const data = await activitiesApi.getAllActivities(authToken);
      setActivities(data.activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const sortActivities = (activities, order) => {
    switch (order) {
      case "latest":
        return [...activities].sort((a, b) => b.activity_id - a.activity_id);
      case "oldest":
        return [...activities].sort((a, b) => a.activity_id - b.activity_id);
      default:
        return activities;
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  useEffect(() => {
    fetchActivities();
  }, [authToken]);

  const handleCreateActivity = async (activity) => {
    setLoading(true);
    try {
      const newActivity = await activitiesApi.createActivity(
        activity,
        authToken
      );
      await fetchActivities();
      setResultModal({
        show: true,
        message: "Activity created successfully!",
        type: "success",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating activity:", error);
      setResultModal({
        show: true,
        message: "Failed to create activity.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActivity = async (id, updatedActivity) => {
    setLoading(true);
    try {
      const updated = await activitiesApi.updateActivity(
        id,
        updatedActivity,
        authToken
      );
      setActivities(
        activities.map((activity) => (activity.id === id ? updated : activity))
      );
      await fetchActivities();
      setResultModal({
        show: true,
        message: "Activity updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating activity:", error);
      setResultModal({
        show: true,
        message: "Failed to update activity.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id) => {
    setLoading(true);
    try {
      await activitiesApi.deleteActivityById(id, authToken);
      await fetchActivities();
      setResultModal({
        show: true,
        message: "Activity deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      setResultModal({
        show: true,
        message: "Failed to delete activity.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleXmlUploadSuccess = async (message) => {
    setModalMessage({
      title: "XML Upload Status",
      message: message || "XML file uploaded successfully!",
    });
    setIsXmlModalOpen(true);
    await fetchActivities();
  };

  const closeXmlModal = () => {
    setIsXmlModalOpen(false);
    setModalMessage({ title: "", message: "" });
  };

  const handleEditClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseEditModal = () => {
    setSelectedActivity(null);
  };

  const handleSaveEdit = async () => {
    if (selectedActivity) {
      await handleUpdateActivity(
        selectedActivity.activity_id,
        selectedActivity
      );
      handleCloseEditModal();
    }
  };

  const handleDeleteClick = (activityId) => {
    setConfirmDelete({ show: true, activityId });
  };

  const confirmDeleteActivity = async () => {
    if (confirmDelete.activityId) {
      await handleDeleteActivity(confirmDelete.activityId);
      setConfirmDelete({ show: false, activityId: null });
    }
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDelete({ show: false, activityId: null });
  };

  const closeResultModal = () => {
    setResultModal({ show: false, message: "", type: "" });
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSaveCreate = async (newActivity) => {
    await handleCreateActivity(newActivity);
  };

  const sortedActivities = sortActivities(activities, sortOrder);

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Manage Activities
      </h1>
      <div className="flex justify-center flex-col">
        <h3 className="text-xl font-semibold py-2">Import Activity XML</h3>
        <XMLUploader onUploadSuccess={handleXmlUploadSuccess} />
      </div>
      <hr className="my-6" />
      <div className="flex justify-center join">
        <div className="btn join-item border border-gray-300">Sort By:</div>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="p-3 border rounded join-item w-full border border-gray-300 bg-white"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <button
          className="btn bg-primary join-item border border-gray-300"
          onClick={handleOpenCreateModal}
        >
          Create Activity
        </button>
      </div>
      <hr className="my-4 " />
      {loading && <div className="text-center">Loading...</div>}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Activity Name</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedActivities.map((activity) => (
            <tr key={activity.activity_id} className="text-center">
              <td className="border px-4 py-2">{activity.activity_name}</td>
              <td className="border px-4 py-2">
                <button
                  className="button-edit-style px-4 mr-2"
                  onClick={() => handleEditClick(activity)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className="button-delete-style px-4"
                  onClick={() => handleDeleteClick(activity.activity_id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedActivity && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Activity</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={selectedActivity.activity_name}
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_name: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Description
                </label>
                <textarea
                  value={selectedActivity.activity_description}
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_description: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Duration (minutes)
                </label>
                <input
                  type="number"
                  value={selectedActivity.activity_duration}
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_duration: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Capacity
                </label>
                <input
                  type="number"
                  value={selectedActivity.activity_capacity}
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_capacity: e.target.value,
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
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="button-main-style"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isCreateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create Activity</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Name
                </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_name: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Description
                </label>
                <textarea
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_description: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Duration (minutes)
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_duration: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Activity Capacity
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setSelectedActivity({
                      ...selectedActivity,
                      activity_capacity: e.target.value,
                    })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="button-secondary-style"
                  onClick={handleCloseCreateModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="button-main-style"
                  onClick={() => handleSaveCreate(selectedActivity)}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isXmlModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{modalMessage.title}</h3>
            <p>{modalMessage.message}</p>
            <div className="modal-action">
              <button
                className="button-secondary-style"
                onClick={closeXmlModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete.show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this activity?</p>
            <div className="modal-action">
              <button
                className="button-secondary-style"
                onClick={closeConfirmDeleteModal}
              >
                Cancel
              </button>
              <button
                className="button-main-style"
                onClick={confirmDeleteActivity}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ResultModal
        show={resultModal.show}
        message={resultModal.message}
        type={resultModal.type}
        closeModal={closeResultModal}
      />
    </div>
  );
}
