import React, { useState, useEffect } from "react";
import * as bookings from "../api/bookings";
import { useAuth } from "../context/AuthContext";
import Banner from "../components/common/Banner";
import AdminTrainerBookingTabContent from "../components/bookingComponents/AdminTrainerBookingTabContent";
import UserBookingTabContent from "../components/bookingComponents/UserBookingTabContent";
import BlogModal from "../components/blogComponents/BlogModal";

export default function Booking() {
  const { authenticatedUser, authToken } = useAuth();
  const [bookedClasses, setBookedClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("confirmed");
  const [expandedDates, setExpandedDates] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (authenticatedUser) {
      fetchUserBookings();
    }
  }, [authenticatedUser]);

  const fetchUserBookings = async () => {
    setIsLoading(true);
    try {
      const data =
        authenticatedUser.user.user_role === "admin" ||
        authenticatedUser.user.user_role === "trainer"
          ? await bookings.getAllBookings(authToken)
          : await bookings.getUserBookings(
              authenticatedUser.user.user_id,
              authToken
            );
      setBookedClasses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (timeString) =>
    new Date(timeString).toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatClassTime = (classTime) => {
    if (typeof classTime === "string") {
      const [hour, minute] = classTime.split(":");
      return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    }
    return null;
  };

  const filteredClasses = bookedClasses.filter(
    (classItem) => classItem.booking_status === tab
  );

  const bookingsByDate = filteredClasses.reduce((acc, classItem) => {
    const classDate = formatDate(classItem.class_date);
    if (!acc[classDate]) acc[classDate] = [];
    acc[classDate].push(classItem);
    return acc;
  }, {});

  const handleSuccessModalClose = async () => {
    setShowSuccessModal(false);
    await fetchUserBookings();
  };

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 pb-20">
        <h2 className="font-semibold py-10 text-xl">MY BOOKINGS</h2>
        {showSuccessModal && (
          <BlogModal
            type="success"
            message={modalMessage}
            onClose={handleSuccessModalClose}
          />
        )}
        {showErrorModal && (
          <BlogModal
            type="error"
            message={modalMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          <button
            role="tab"
            className={`tab text-lg ${tab === "confirmed" ? "tab-active" : ""}`}
            aria-label="Confirmed"
            onClick={() => setTab("confirmed")}
          >
            Confirmed
          </button>
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {authenticatedUser.user.user_role === "admin" ||
            authenticatedUser.user.user_role === "trainer" ? (
              <AdminTrainerBookingTabContent
                bookingsByDate={bookingsByDate}
                expandedDates={expandedDates}
                fetchUserBookings={fetchUserBookings}
                onToggleDate={handleToggleDate}
                tab={tab}
                formatClassTime={formatClassTime}
                formatDate={formatDate}
                formatTime={formatTime}
                isLoading={isLoading}
                error={error}
                setShowSuccessModal={setShowSuccessModal}
                setShowErrorModal={setShowErrorModal}
                setModalMessage={setModalMessage}
              />
            ) : (
              <UserBookingTabContent
                bookingsByDate={bookingsByDate}
                expandedDates={expandedDates}
                fetchUserBookings={fetchUserBookings}
                onToggleDate={handleToggleDate}
                tab={tab}
                formatClassTime={formatClassTime}
                formatDate={formatDate}
                formatTime={formatTime}
                isLoading={isLoading}
                error={error}
                setShowSuccessModal={setShowSuccessModal}
                setShowErrorModal={setShowErrorModal}
                setModalMessage={setModalMessage}
              />
            )}
          </div>

          {(authenticatedUser.user.user_role === "admin" ||
            authenticatedUser.user.user_role === "trainer") && (
            <>
              <button
                role="tab"
                className={`tab text-lg ${tab === "cancelled" ? "tab-active" : ""}`}
                aria-label="Cancelled"
                onClick={() => setTab("cancelled")}
              >
                Cancelled
              </button>
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                {authenticatedUser.user.user_role === "admin" ||
                authenticatedUser.user.user_role === "trainer" ? (
                  <AdminTrainerBookingTabContent
                    bookingsByDate={bookingsByDate}
                    expandedDates={expandedDates}
                    fetchUserBookings={fetchUserBookings}
                    onToggleDate={handleToggleDate}
                    tab={tab}
                    formatClassTime={formatClassTime}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    isLoading={isLoading}
                    error={error}
                    setShowSuccessModal={setShowSuccessModal}
                    setShowErrorModal={setShowErrorModal}
                    setModalMessage={setModalMessage}
                  />
                ) : (
                  <UserBookingTabContent
                    bookingsByDate={bookingsByDate}
                    expandedDates={expandedDates}
                    fetchUserBookings={fetchUserBookings}
                    onToggleDate={handleToggleDate}
                    tab={tab}
                    formatClassTime={formatClassTime}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    isLoading={isLoading}
                    error={error}
                    setShowSuccessModal={setShowSuccessModal}
                    setShowErrorModal={setShowErrorModal}
                    setModalMessage={setModalMessage}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
