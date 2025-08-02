import React from "react";
import ResultModal from "../UserComponents/ResultModal";
import EditClubModal from "./EditClubModal";
import CreateClubModal from "./CreateClubModal";

export default function ClubModals({
  selectedClub,
  isCreateModalOpen,
  isXmlModalOpen,
  confirmDelete,
  modalMessage,
  handleCloseEditModal,
  handleSaveEdit,
  handleCloseCreateModal,
  handleSaveCreate,
  closeXmlModal,
  closeConfirmDeleteModal,
  confirmDeleteClub,
  resultModal,
  closeResultModal,
}) {
  return (
    <>
      {selectedClub && (
        <EditClubModal
          selectedClub={selectedClub}
          handleCloseEditModal={handleCloseEditModal}
          handleSaveEdit={handleSaveEdit}
        />
      )}
      {isCreateModalOpen && (
        <CreateClubModal
          handleCloseCreateModal={handleCloseCreateModal}
          handleSaveCreate={handleSaveCreate}
        />
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
            <p>Are you sure you want to delete this club?</p>
            <div className="modal-action">
              <button
                className="button-secondary-style"
                onClick={closeConfirmDeleteModal}
              >
                Cancel
              </button>
              <button className="button-main-style" onClick={confirmDeleteClub}>
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
    </>
  );
}
