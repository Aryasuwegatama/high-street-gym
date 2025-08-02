import React, { useState, useEffect } from "react";
import * as classes from "../../../api/classes";
import * as bookings from "../../../api/bookings";
import * as clubsApi from "../../../api/clubs";
import ClubDropdown from "./MbDropdown";
import TimetableHeader from "./MbTimetableHeader";
import ClassList from "./MbClassList";
import ClassModal from "./MbClassModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function MobileTimetable() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedClub, setSelectedClub] = useState(null);
  const [classData, setClassData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [trainerAvailability, setTrainerAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const { authenticatedUser, authToken } = useAuth();
  const navigate = useNavigate();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClassData = async () => {
      if (!selectedClub) return;
      setIsLoading(true);
      setError(null);
      try {
        // console.log(selectedClub.club_name);
        const data = await classes.getClassesByClub(
          selectedClub.club_name,
          authToken
        );
        // console.log(data);
        setClassData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassData();
  }, [selectedClub, authToken]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await clubsApi.getAllClubs(authToken);
        console.log(data);
        setClubs(data.clubs);
      } catch (err) {
        console.error("Failed to fetch clubs", err);
      }
    };
    fetchClubs();
  }, [authToken]);

  const handlePrevDate = () => {
    const newDate = new Date(activeDate);
    newDate.setDate(newDate.getDate() - 1);
    setActiveDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(activeDate);
    newDate.setDate(activeDate.getDate() + 1);
    const today = new Date();
    const daysUntilNextSunday = 7 - today.getDay();
    const threeWeeksFromNow = new Date(today);
    threeWeeksFromNow.setDate(today.getDate() + daysUntilNextSunday + 21);
    if (newDate <= threeWeeksFromNow) {
      setActiveDate(newDate);
    }
  };

  const formattedActiveDate = activeDate.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const filterClasses = (timeFilter) => {
    return classData
      .filter((classItem) => {
        const classTimeHour =
          classItem.class_time && typeof classItem.class_time === "string"
            ? parseInt(classItem.class_time.split(":")[0], 10)
            : null;
        return (
          classItem.class_date === formattedActiveDate &&
          timeFilter(classTimeHour) &&
          classItem.club_name === selectedClub.club_name
        );
      })
      .sort((a, b) => {
        const timeA = a.class_time.split(":").map(Number);
        const timeB = b.class_time.split(":").map(Number);
        return timeA[0] - timeB[0] || timeA[1] - timeB[1];
      });
  };

  const morningClasses = filterClasses((hour) => hour < 12);
  const afternoonClasses = filterClasses((hour) => hour >= 12 && hour < 17);
  const eveningClasses = filterClasses((hour) => hour >= 17);

  const handleOpenModal = (classItem) => {
    setSelectedClass(classItem);
    setSelectedTrainer("");
    setTrainerAvailability(null);
  };

  const handleCloseModal = () => setSelectedClass(null);

  // get trainer avaialability
  const fetchTrainerAvailability = async (classId, trainerName) => {
    try {
      setLoadingAvailability(true);
      const response = await classes.getTrainerAvailability(
        classId,
        trainerName,
        authToken
      ); // Pass authToken
      setTrainerAvailability(response.booking_count);
    } catch (error) {
      console.error("Failed to fetch trainer availability", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleBookingSuccess = ({ title, message, success = false }) => {
    setModalMessage({ title, message });
    setBookingSuccess(success);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setModalMessage({ title: "", message: "" });
    setBookingSuccess(false);
  };

  const handleViewBooking = () => {
    navigate("/bookings");
    closeBookingModal();
  };

  const handleBooking = async () => {
    try {
      if (!authenticatedUser) {
        handleBookingSuccess({
          title: "Authentication Required",
          message: "Please log in to book classes.",
        });
        return;
      }
      if (!selectedClass || !selectedTrainer) {
        handleBookingSuccess({
          title: "Booking Error",
          message: "Please select a trainer to book this class.",
        });
        return;
      }

      const result = await bookings.bookClass(
        selectedClass.class_id,
        selectedTrainer,
        authenticatedUser.user.user_id,
        authToken
      );

      handleBookingSuccess({
        title: "Booking Confirmation",
        message: result.message || "Class booked successfully!",
        success: true,
      });
      handleCloseModal();
    } catch (error) {
      handleBookingSuccess({
        title: "Booking Error",
        message:
          error.message === "You have already booked this class."
            ? "You have already booked this class."
            : "Failed to book class. Please try again.",
        success: false,
      });
    }
  };

  const handleRedirectToManageClasses = () => {
    navigate("/manage-classes");
  };
  const handleRedirectToManageActivities = () => {
    navigate("/manage-activities");
  };

  return (
    <>
      <h3 className="font-semibold p-2">
        {new Date().toLocaleDateString("en-AU", {
          weekday: "long",
        })}
        ,{" "}
        {new Date().toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h3>
      <ClubDropdown
        clubs={clubs}
        selectedClub={selectedClub}
        setSelectedClub={setSelectedClub}
      />

      <div className="container mx-auto p-2 pb-20">
        {!authenticatedUser ? (
          <div className="text-center py-4">
            <span>Please </span>
            <button
              className="underline text-info"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>
            <span> or </span>
            <button
              className="underline text-info"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            <span> to see classes.</span>
          </div>
        ) : (
          <>
            {authenticatedUser && authenticatedUser.user.user_role === "admin" && (
              <div className="pt-6 mx-auto">
                <button className="btn" onClick={handleRedirectToManageActivities}>
                  Manage Activities
                </button>
                <button className="btn ml-2" onClick={handleRedirectToManageClasses}>
                  Manage Classes
                </button>
                <hr className="my-4 " />
              </div>
            )}
            <TimetableHeader
              activeDate={activeDate}
              handlePrevDate={handlePrevDate}
              handleNextDate={handleNextDate}
            />
            <ClassList
              isLoading={isLoading}
              error={error}
              selectedClub={selectedClub}
              handleOpenModal={handleOpenModal}
              morningClasses={morningClasses}
              afternoonClasses={afternoonClasses}
              eveningClasses={eveningClasses}
              authenticatedUser={authenticatedUser}
            />
          </>
        )}
      </div>
      {selectedClass && (
        <ClassModal
          selectedClass={selectedClass}
          selectedTrainer={selectedTrainer}
          setSelectedTrainer={setSelectedTrainer}
          trainerAvailability={trainerAvailability}
          loadingAvailability={loadingAvailability}
          handleCloseModal={handleCloseModal}
          fetchTrainerAvailability={fetchTrainerAvailability}
          handleBooking={handleBooking}
        />
      )}
      {isBookingModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{modalMessage.title}</h3>
            <p>{modalMessage.message}</p>
            <div className="modal-action">
              <button
                className="button-secondary-style text-sm"
                onClick={closeBookingModal}
              >
                Close
              </button>
              {bookingSuccess && (
                <button
                  className="button-main-style text-sm text-base-100"
                  onClick={handleViewBooking}
                >
                  View My Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
