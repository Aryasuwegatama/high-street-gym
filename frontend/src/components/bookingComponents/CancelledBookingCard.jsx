import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";


import * as classes from "../../api/classes"; // Import API functions

export default function CancelledBookingCard({
  classItem,
  formatClassTime,
  formatDate,
  formatTime,
  fetchUserBookings,
}) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null); // Handle errors

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null); // Clear any error on close
  };

  const handleOpenModal = () => setShowModal(true);

  const handleRemoveBooking = async () => {
    try {
      const result = await classes.deleteClassBooking(classItem.booking_id);
      if (!result || result.status !== 200) {
        throw new Error("Deletion failed. Please try again.");
      }
      fetchUserBookings(); // Refresh bookings
      handleCloseModal();
    } catch (error) {
      console.error("Remove Booking Error:", error);
      setError(error.message); // Display error message
    }
  };

  return (
    <div className="card bg-red-50 shadow-lg p-4 relative border">
    <div className="text-lg font-bold my-2">
      <div className="block py-2 md:inline">
        {classItem.activity_name} - {formatClassTime(classItem.class_time)}
      </div>
      <div className="block py-2 md:inline">
        <p className="bg-gray-200 inline rounded-full px-4 py-1 ml-0 md:ml-2 font-semibold text-sm">
          {classItem.club_name}
        </p>
        <span className="bg-error rounded-full px-4 py-1 mx-2 font-semibold text-sm text-base-100">
          Cancelled
        </span>
      </div>
    </div>
    <div className="flex gap-2">
      <p>{classItem.activity_duration} Minutes</p>
      <p className="font-semibold">- {classItem.trainer_name}</p>
    </div>
    <p className="text-sm font-bold my-4">
      Booked At:{" "}
      <span className="font-semibold">
        {formatDate(classItem.class_date)}, {formatTime(classItem.booking_created_date)}
      </span>
    </p>
    {/* <hr className="border-gray-400 my-4" /> */}
    <div className="modal-action absolute right-4 top-0">
      <button className="" onClick={handleOpenModal}>
        <FaTrashCan className="w-4 md:w-5 h-4 md:h-5 text-error" />
      </button>
    </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Remove Booking</h3>
            <p>Are you sure you want to delete this booking? <br /> This action cannot be undone.</p>

            {error && <p className="text-error mt-4">{error}</p>} {/* Show error if any */}

            <div className="modal-action">
              <button className="button-secondary-style text-sm" onClick={handleCloseModal}>
                Close
              </button>
              <button className="button-delete-style" onClick={handleRemoveBooking}>
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
