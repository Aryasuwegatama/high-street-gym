import React, { useState, useEffect } from "react";
import * as classes from "../api/classes";
import { userIdTest } from "../user-session-sample";
import Banner from "../components/common/Banner";
import BookingTabContent from "../components/bookingComponents/BookingTabContent";
import Footer from "../components/common/Footer";

export default function Booking() {
  const [bookedClasses, setBookedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("confirmed");
  const [expandedDates, setExpandedDates] = useState({});

  const fetchUserBookings = async () => {
    setIsLoading(true);
    try {
      const data = await classes.getUserBookings(userIdTest); // Test user ID
      setBookedClasses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

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

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 pb-20">
        <h2 className="font-semibold py-10 text-xl">MY BOOKINGS</h2>
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          <input
            type="radio"
            name="booking_tabs"
            role="tab"
            className="tab text-lg"
            aria-label="Confirmed"
            checked={tab === "confirmed"}
            onChange={() => setTab("confirmed")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <BookingTabContent
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
            />
          </div>

          <input
            type="radio"
            name="booking_tabs"
            role="tab"
            className="tab text-lg"
            aria-label="Cancelled"
            checked={tab === "cancelled"}
            onChange={() => setTab("cancelled")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <BookingTabContent
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
            />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
