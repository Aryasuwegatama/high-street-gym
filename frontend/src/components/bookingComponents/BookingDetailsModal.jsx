// components/ClassDetailsModal.jsx
import React from "react";

export default function BookingDetailsModal({
  selectedClass,
  formatClassTime,
  formatDate,
  formatTime,
  onClose,
  onCancel,
  onRemove,
}) {
  const handleAction = async () => {
    try {
      if (selectedClass.booking_status === "confirmed") {
        await onCancel(); // Ensure this resolves before proceeding
      } else {
        await onRemove(); // Same for removing the booking
      }
    } catch (error) {
      console.error("Error handling booking action:", error);
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="text-lg font-bold my-2">
          {selectedClass.booking_status === "cancelled" ? (
            <p className="text-error py-2">This booking has been canceled.</p>
          ) : (
            <p className="text-success py-2">This booking is confirmed.</p>
          )}
          <div className="block py-2 md:inline ">
            {selectedClass.activity_name} -{" "}
            {formatClassTime(selectedClass.class_time)}
          </div>
          <div className="block py-2 md:inline ">
            <p className="bg-gray-200 inline rounded-full px-4 py-1 ml-2 font-semibold text-sm">
              {selectedClass.club_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <p>{selectedClass.activity_duration} Minutes</p>
          <p className="font-semibold">- {selectedClass.trainer_name}</p>
        </div>
        <p className="text-sm font-bold my-4">
          Booked At:{" "}
          <span className="font-semibold">
            {formatDate(selectedClass.class_date)},{" "}
            {formatTime(selectedClass.booking_created_date)}
          </span>
        </p>
        <hr className="my-4" />
        <div className="modal-action">
          <button className="button-secondary-style text-sm" onClick={onClose}>
            Close
          </button>
          <button
            className={`button-main-style text-sm bg-error hover:bg-warning text-base-100`}
            onClick={handleAction} // Call appropriate action handler
          >
            {selectedClass.booking_status === "confirmed"
              ? "Cancel Booking"
              : "Remove Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
