import React from "react";
import LoadingSpinner from "../common/LoadingSpinner";

export default function UserConfirmationModal({
  show,
  message,
  deleting,
  selfDeleteAttempt,
  setSelfDeleteAttempt,
  userHasBookings,
  deleteUserWithBookings,
  deleteUserWithoutBookings,
  deleteTrainerWithActivities,
  closeModal,
  userRole,
}) {
  if (!show) return null;

  const handleClose = () => {
    closeModal();
    setSelfDeleteAttempt(false);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-xl font-bold">Confirm</h3>
        <p className="py-4">{message}</p>
        {deleting ? (
          <LoadingSpinner size="lg" color="info" />
        ) : (
          <div className="modal-action">
            {selfDeleteAttempt ? (
              <button
                className="button-secondary-style text-sm"
                onClick={handleClose}
              >
                Close
              </button>
            ) : (
              <>
                {userRole === "trainer" ? (
                  <button
                    className="button-delete-style"
                    onClick={deleteTrainerWithActivities}
                  >
                    Delete Trainer
                  </button>
                ) : userHasBookings ? (
                  <button
                    className="button-delete-style"
                    onClick={deleteUserWithBookings}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className="button-delete-style"
                    onClick={deleteUserWithoutBookings}
                  >
                    Delete User
                  </button>
                )}
              </>
            )}
            {!selfDeleteAttempt && (
              <button
                className="button-secondary-style text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
