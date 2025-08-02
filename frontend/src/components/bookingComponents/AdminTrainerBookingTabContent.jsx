import React from "react";
import ConfirmedBookingCard from "./ConfirmedBookingCard";
import CancelledBookingCard from "./CancelledBookingCard";

export default function AdminTrainerBookingTabContent({
  bookingsByDate,
  expandedDates,
  fetchUserBookings,
  tab,
  formatClassTime,
  formatDate,
  formatTime,
  onToggleDate,
  isLoading,
  error,
  setShowSuccessModal,
  setShowErrorModal,
  setModalMessage,
}) {
  if (isLoading) {
    return (
      <div className="col-span-full text-center py-4">
        <span className="loading loading-spinner loading-lg text-info"></span>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (Object.keys(bookingsByDate).length === 0) {
    return tab === "confirmed" ? (
      <p>No Confirmed bookings found.</p>
    ) : (
      <p>No Cancelled bookings found.</p>
    );
  }

  const handleSuccess = (message) => {
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const handleError = (message) => {
    setModalMessage(message);
    setShowErrorModal(true);
  };

  const bookingsByUser = Object.entries(bookingsByDate).reduce(
    (acc, [date, classes]) => {
      classes.forEach((classItem) => {
        const userName = classItem.user_name;
        if (!acc[userName]) acc[userName] = [];
        acc[userName].push({ ...classItem, date });
      });
      return acc;
    },
    {}
  );

  const handleToggleDate = (userName, date) => {
    onToggleDate(`${userName}-${date}`);
  };

  return (
    <div className="space-y-4">
      {Object.entries(bookingsByUser).map(([userName, classes]) => (
        <div key={userName} className="border rounded-lg p-4 bg-gray-100">
          <div className="font-bold text-lg">{userName}</div>
          <hr className="my-2" />
          {classes.map((classItem) => (
            <div key={classItem.booking_id} className="mb-4">
              <div
                className="cursor-pointer font-bold text-lg mb-2"
                onClick={() => handleToggleDate(userName, classItem.date)}
              >
                {formatDate(classItem.date)} ▼
              </div>
              {expandedDates[`${userName}-${classItem.date}`] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tab === "confirmed" ? (
                    <ConfirmedBookingCard
                      key={classItem.booking_id}
                      classItem={classItem}
                      formatClassTime={formatClassTime}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      fetchUserBookings={fetchUserBookings}
                    />
                  ) : (
                    <CancelledBookingCard
                      key={classItem.booking_id}
                      classItem={classItem}
                      formatClassTime={formatClassTime}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      fetchUserBookings={fetchUserBookings}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
