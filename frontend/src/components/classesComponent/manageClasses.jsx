import React, { useState, useEffect } from "react";
import * as classesApi from "../../api/classes";
import * as clubsApi from "../../api/clubs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ClassTable from "./ClassTable";
import ClassModals from "./ClassModals";
import LoadingSpinner from "../common/LoadingSpinner";

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [resultModal, setResultModal] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    classId: null,
    message: "",
    loading: false,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { authToken } = useAuth();
  const [sortOrder, setSortOrder] = useState("latest");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });

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

  const fetchClasses = async (clubName) => {
    setLoading(true);
    try {
      const data = await classesApi.getClassesByClub(clubName, authToken);
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClub) {
      fetchClasses(selectedClub.club_name);
    }
  }, [selectedClub, authToken]);

  const sortClasses = (classes, order) => {
    switch (order) {
      case "latest":
        return [...classes].sort((a, b) => b.class_id - a.class_id);
      case "oldest":
        return [...classes].sort((a, b) => a.class_id - b.class_id);
      case "time-morning-to-evening":
        return [...classes].sort((a, b) => (a.class_time || "").localeCompare(b.class_time || ""));
      case "time-evening-to-morning":
        return [...classes].sort((a, b) => (b.class_time || "").localeCompare(a.class_time || ""));
      case "name-asc":
        return [...classes].sort((a, b) => (a.activity_name || "").localeCompare(b.activity_name || ""));
      case "name-desc":
        return [...classes].sort((a, b) => (b.activity_name || "").localeCompare(a.activity_name || ""));
      default:
        return classes;
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleCreateClass = async (classData) => {
    setLoading(true);
    try {
      const createData = {
        class_date: classData.class_date,
        class_time: classData.class_time,
        class_club_id: classData.club_id,
        class_activity_id: classData.activity_id,
      };
      const newClass = await classesApi.createClass(createData, authToken);
      await fetchClasses(selectedClub.club_name);
      setResultModal({
        show: true,
        message: "Class created successfully!",
        type: "success",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating class:", error);
      setResultModal({
        show: true,
        message: error.message || "Failed to create class.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async (id, updatedClass) => {
    setLoading(true);
    try {
      const updateData = {
        class_date: updatedClass.class_date,
        class_time: updatedClass.class_time,
        class_club_id: updatedClass.club_id,
        class_activity_id: updatedClass.activity_id,
      };
      console.log("updateData", updateData);
      const updated = await classesApi.updateClass(id, updateData, authToken);
      console.log("class id:" + id);
      setClasses(classes.map((cls) => (cls.class_id === id ? updated : cls)));
      await fetchClasses(selectedClub.club_name);
      setResultModal({
        show: true,
        message: "Class updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating class:", error);
      let errorMessage = "Failed to update class.";
      if (error.message.includes("Duplicate entry")) {
        errorMessage = "Duplicate entry for class schedule. Class Name, Club, Date and Time cannot be the same.";
      } else if (error.message.includes("No classes found")) {
        errorMessage = "No classes found for the given ID.";
      }
      setResultModal({
        show: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id) => {
    setConfirmDelete({
      show: true,
      classId: id,
      message: "Checking associated bookings for this class...",
      loading: true,
    });
    try {
      const bookings = await classesApi.checkClassBookings(id, authToken);
      if (bookings.length > 0) {
        setConfirmDelete({
          show: true,
          classId: id,
          message: "This class has bookings associated with it. Do you want to continue deleting? This action cannot be undone.",
          loading: false,
        });
      } else {
        setConfirmDelete({
          show: true,
          classId: id,
          message: "There are no bookings for this class. Do you want to continue deleting?",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error checking class bookings:", error);
      setResultModal({
        show: true,
        message: error.message || "Failed to check class bookings.",
        type: "error",
      });
      setConfirmDelete({ show: false, classId: null, message: "", loading: false });
    }
  };

  const confirmDeleteClass = async () => {
    if (confirmDelete.classId) {
      setLoading(true);
      try {
        await classesApi.deleteClass(confirmDelete.classId, authToken);
        await fetchClasses(selectedClub.club_name);
        setResultModal({
          show: true,
          message: "Class deleted successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting class:", error);
        setResultModal({
          show: true,
          message: error.message || "Failed to delete class.",
          type: "error",
        });
      } finally {
        setLoading(false);
        setConfirmDelete({ show: false, classId: null, message: "", loading: false });
      }
    }
  };

  const handleEditClick = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleCloseEditModal = () => {
    setSelectedClass(null);
  };

  const handleSaveEdit = async (updatedClass) => {
    if (selectedClass) {
      await handleUpdateClass(selectedClass.class_id, updatedClass);
      handleCloseEditModal();
    }
  };

  const handleDeleteClick = (classId) => {
    handleDeleteClass(classId);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDelete({ show: false, classId: null, message: "", loading: false });
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

  const handleSaveCreate = async (newClass) => {
    await handleCreateClass(newClass);
  };

  const sortedClasses = sortClasses(classes, sortOrder);

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Manage Classes</h1>
      <div className="flex justify-center flex-col">
        <h3 className="text-xl font-semibold py-2">Select Club</h3>
        <select
          value={selectedClub ? selectedClub.club_id : ""}
          onChange={(e) => {
            const club = clubs.find(
              (club) => club.club_id === parseInt(e.target.value, 10)
            );
            setSelectedClub(club);
          }}
          className="p-3 border rounded w-full border-gray-300 bg-white"
        >
          <option value="" disabled>
            Select a club
          </option>
          {clubs.map((club) => (
            <option key={club.club_id} value={club.club_id}>
              {club.club_name}
            </option>
          ))}
        </select>
      </div>
      <hr className="my-6" />
      <div className="flex justify-center join">
        <div className="btn join-item border-gray-300">Sort By:</div>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="p-3 border rounded join-item w-full border-gray-300 bg-white"
        >
          <option value="latest">Latest By ID</option>
          <option value="oldest">Oldest By ID</option>
          <option value="time-morning-to-evening">Class Time (Morning to Evening)</option>
          <option value="time-evening-to-morning">Class Time (Evening to Morning)</option>
          <option value="name-asc">Class Name (A to Z)</option>
          <option value="name-desc">Class Name (Z to A)</option>
        </select>
        <button
          className="btn bg-primary join-item border-gray-300"
          onClick={handleOpenCreateModal}
        >
          Create Class
        </button>
      </div>
      <hr className="my-4 " />
      <ClassTable
        classes={sortedClasses}
        loading={loading}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <ClassModals
        selectedClass={selectedClass}
        isCreateModalOpen={isCreateModalOpen}
        confirmDelete={confirmDelete}
        modalMessage={modalMessage}
        handleCloseEditModal={handleCloseEditModal}
        handleSaveEdit={handleSaveEdit}
        handleCloseCreateModal={handleCloseCreateModal}
        handleSaveCreate={handleSaveCreate}
        closeConfirmDeleteModal={closeConfirmDeleteModal}
        confirmDeleteClass={confirmDeleteClass}
        resultModal={resultModal}
        closeResultModal={closeResultModal}
      />
      {confirmDelete.show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            {confirmDelete.loading ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner />
                <p className="ml-2">{confirmDelete.message}</p>
              </div>
            ) : (
              <>
                <p>{confirmDelete.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone. Please confirm if you want to proceed with the deletion.
                </p>
                <div className="modal-action">
                  <button
                    type="button"
                    className="button-secondary-style"
                    onClick={closeConfirmDeleteModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="button-main-style"
                    onClick={confirmDeleteClass}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Continue"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
