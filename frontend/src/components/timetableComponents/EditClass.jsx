import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import * as classes from "../../api/classes";
import { useAuth } from "../../context/AuthContext";

export default function EditClass() {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken } = useAuth(); // Get authToken from context
  const [classData, setClassData] = useState(location.state.classItem);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await classes.updateClass(classId, classData, authToken); // Pass authToken
      setFeedbackMessage("Class updated successfully!");
      setShowFeedbackModal(true);
    } catch (error) {
      console.error("Failed to update class:", error);
      setFeedbackMessage("Failed to update class. Please try again.");
      setShowFeedbackModal(true);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 7; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const handleConfirmSave = () => {
    setShowConfirmationModal(true);
  };

  const handleCancelSave = () => {
    setShowConfirmationModal(false);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    navigate("/timetable");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Class</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Activity Name</label>
          <input
            type="text"
            name="activity_name"
            value={classData.activity_name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Class Time</label>
          <select
            name="class_time"
            value={classData.class_time}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Activity Duration</label>
          <input
            type="text"
            name="activity_duration"
            value={classData.activity_duration}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Activity Description</label>
          <textarea
            name="activity_description"
            value={classData.activity_description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <button
          type="button"
          className="button-main-style"
          onClick={handleConfirmSave}
        >
          Save
        </button>
        <button
          type="button"
          className="button-secondary-style ml-2"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </form>

      {showConfirmationModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Save</h3>
            <p>Are you sure you want to save the changes?</p>
            <div className="modal-action">
              <button
                className="button-secondary-style"
                onClick={handleCancelSave}
              >
                Cancel
              </button>
              <button
                className="button-main-style"
                onClick={() => {
                  setShowConfirmationModal(false);
                  handleSave();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Feedback</h3>
            <p>{feedbackMessage}</p>
            <div className="modal-action">
              <button
                className="button-main-style"
                onClick={handleFeedbackClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
