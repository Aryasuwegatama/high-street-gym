import React from "react";
import ResultModal from "../UserComponents/ResultModal";
import EditClassModal from "./EditClassModal";
import CreateClassModal from "./CreateClassModal";

export default function ClassModals({
  selectedClass,
  isCreateModalOpen,
  confirmDelete,
  handleCloseEditModal,
  handleSaveEdit,
  handleCloseCreateModal,
  handleSaveCreate,
  closeConfirmDeleteModal,
  confirmDeleteClass,
  resultModal,
  closeResultModal,
}) {
  return (
    <>
      {selectedClass && (
        <EditClassModal
          selectedClass={selectedClass}
          handleCloseEditModal={handleCloseEditModal}
          handleSaveEdit={handleSaveEdit}
        />
      )}
      {isCreateModalOpen && (
        <CreateClassModal
          handleCloseCreateModal={handleCloseCreateModal}
          handleSaveCreate={handleSaveCreate}
        />
      )}
      {confirmDelete.show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this class?</p>
            <div className="modal-action">
              <button
                className="button-secondary-style"
                onClick={closeConfirmDeleteModal}
              >
                Cancel
              </button>
              <button className="button-main-style" onClick={confirmDeleteClass}>
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