import React, { useState, useEffect } from "react";
import * as clubsApi from "../../api/clubs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import XMLUploaderClubs from "../XML/XMLUploaderClubs";
import ClubTable from "./ClubTable";
import ClubModals from "./ClubModals";

export default function ManageClubs() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [resultModal, setResultModal] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    clubId: null,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { authToken } = useAuth();
  const [sortOrder, setSortOrder] = useState("latest");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isXmlModalOpen, setIsXmlModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });

  const fetchClubs = async () => {
    try {
      const data = await clubsApi.getAllClubs(authToken);
      setClubs(data.clubs);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const sortClubs = (clubs, order) => {
    switch (order) {
      case "latest":
        return [...clubs].sort((a, b) => b.club_id - a.club_id);
      case "oldest":
        return [...clubs].sort((a, b) => a.club_id - b.club_id);
      default:
        return clubs;
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  useEffect(() => {
    fetchClubs();
  }, [authToken]);

  const handleCreateClub = async (club) => {
    setLoading(true);
    try {
      const newClub = await clubsApi.createClub(club, authToken);
      await fetchClubs();
      setResultModal({
        show: true,
        message: "Club created successfully!",
        type: "success",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating club:", error);
      setResultModal({
        show: true,
        message: "Failed to create club.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClub = async (id, updatedClub) => {
    setLoading(true);
    try {
      const updated = await clubsApi.updateClub(id, updatedClub, authToken);
      setClubs(clubs.map((club) => (club.id === id ? updated : club)));
      await fetchClubs();
      setResultModal({
        show: true,
        message: "Club updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating club:", error);
      setResultModal({
        show: true,
        message: "Failed to update club.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = async (id) => {
    setLoading(true);
    try {
      await clubsApi.deleteClub(id, authToken);
      await fetchClubs();
      setResultModal({
        show: true,
        message: "Club deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting club:", error);
      setResultModal({
        show: true,
        message: "Failed to delete club.",
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
    await fetchClubs();
  };

  const closeXmlModal = () => {
    setIsXmlModalOpen(false);
    setModalMessage({ title: "", message: "" });
  };

  const handleEditClick = (club) => {
    setSelectedClub(club);
  };

  const handleCloseEditModal = () => {
    setSelectedClub(null);
  };

  const handleSaveEdit = async (updatedClub) => {
    if (selectedClub) {
      await handleUpdateClub(selectedClub.club_id, updatedClub);
      handleCloseEditModal();
    }
  };

  const handleDeleteClick = (clubId) => {
    setConfirmDelete({ show: true, clubId });
  };

  const confirmDeleteClub = async () => {
    if (confirmDelete.clubId) {
      await handleDeleteClub(confirmDelete.clubId);
      setConfirmDelete({ show: false, clubId: null });
    }
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDelete({ show: false, clubId: null });
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

  const handleSaveCreate = async (newClub) => {
    await handleCreateClub(newClub);
  };

  const sortedClubs = sortClubs(clubs, sortOrder);

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-semibold mb-4 text-center">Manage Clubs</h1>
      <div className="flex justify-center flex-col">
        <h3 className="text-xl font-semibold py-2">Import Club XML</h3>
        <XMLUploaderClubs onUploadSuccess={handleXmlUploadSuccess} />
      </div>
      <hr className="my-6" />
      <div className="flex justify-center join">
        <div className="btn join-item border-gray-300">Sort By:</div>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="p-3 border rounded join-item w-full border-gray-300 bg-white"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <button
          className="btn bg-primary join-item border-gray-300"
          onClick={handleOpenCreateModal}
        >
          Create Club
        </button>
      </div>
      <hr className="my-4 " />
      {loading && <div className="text-center">Loading...</div>}
      <ClubTable
        clubs={sortedClubs}
        loading={loading}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <ClubModals
        selectedClub={selectedClub}
        isCreateModalOpen={isCreateModalOpen}
        isXmlModalOpen={isXmlModalOpen}
        confirmDelete={confirmDelete}
        modalMessage={modalMessage}
        handleCloseEditModal={handleCloseEditModal}
        handleSaveEdit={handleSaveEdit}
        handleCloseCreateModal={handleCloseCreateModal}
        handleSaveCreate={handleSaveCreate}
        closeXmlModal={closeXmlModal}
        closeConfirmDeleteModal={closeConfirmDeleteModal}
        confirmDeleteClub={confirmDeleteClub}
        resultModal={resultModal}
        closeResultModal={closeResultModal}
      />
    </div>
  );
}
