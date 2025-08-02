import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import TimetableHeader from "./DtTimetableHeader";
import ClubDropdown from "./ClubDropDown";
import ClassList from "./ClassList";
import ClassModal from "./ClassModal";
import * as classes from "../../../api/classes";
import * as bookings from "../../../api/bookings";
import * as clubsApi from "../../../api/clubs";
import { useNavigate } from "react-router-dom";

export default function DesktopTimetable() {
  const { authenticatedUser, authToken } = useAuth();
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedClub, setSelectedClub] = useState(null);
  const [classData, setClassData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [trainerAvailability, setTrainerAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const navigate = useNavigate();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchClassData = async () => {
      if (!selectedClub) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await classes.getClassesByClub(
          selectedClub.club_name,
          authToken
        ); // Use authToken
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
        setClubs(data.clubs);
      } catch (err) {
        console.error("Failed to fetch clubs", err);
      }
    };
    fetchClubs();
  }, [authToken]);

  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay() || 7;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek - 1));
    return startOfWeek;
  };

  const activeWeekStart = getStartOfWeek(activeDate);
  const thisWeekStart = getStartOfWeek(new Date());

  const getWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const currentWeekDates = getWeekDates(activeWeekStart);
  const firstWeekDates = getWeekDates(thisWeekStart);

  const haveCommonDates = (arr1, arr2) => {
    return arr1.some((date1) =>
      arr2.some((date2) => date1.toDateString() === date2.toDateString())
    );
  };

  const checkThisWeekDates = haveCommonDates(currentWeekDates, firstWeekDates);

  const handlePrevWeek = () => {
    const newDate = new Date(activeWeekStart);
    newDate.setDate(activeWeekStart.getDate() - 7);
    const currentWeek = new Date();
    currentWeek.setDate(currentWeek.getDate() - 7);
    if (newDate >= currentWeek) setActiveDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(activeWeekStart);
    newDate.setDate(activeWeekStart.getDate() + 7);
    const threeWeeksFromNow = new Date();
    threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);
    if (newDate < threeWeeksFromNow) setActiveDate(newDate);
  };

  const handleOpenModal = (classItem) => setSelectedClass(classItem);
  const handleCloseModal = () => setSelectedClass(null);

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

  const handleBookingSuccess = ({ title, message, success = false }) => {
    setModalMessage({ title, message });
    setBookingSuccess(success);
    setIsBookingModalOpen(true);
  };

  const handleViewBooking = () => {
    navigate("/bookings");
    closeBookingModal();
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setModalMessage("");
    setBookingSuccess(false);
  };

  const handleRedirectToManageActivities = () => {
    navigate("/manage-activities");
  };

  const handleRedirectToManageClasses = () => {
    navigate("/manage-classes");
  };

  return (
    <>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-4 items-center p-4 justify-center">
          {authenticatedUser &&
            authenticatedUser.user.user_role === "admin" && (
              <div className="pt-6 mx-auto">
                <button
                  className="btn"
                  onClick={handleRedirectToManageActivities}
                >
                  Manage Activities
                </button>
                <button className="btn ml-2" onClick={handleRedirectToManageClasses}>
                  Manage Classes
                </button>
                <hr className="my-4 " />
              </div>
            )}

          <h3 className="font-semibold">
            {new Date().toLocaleDateString("en-AU", {
              weekday: "long",
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

          <div className="container py-2 mx-auto">
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
                <TimetableHeader
                  handleNextWeek={handleNextWeek}
                  handlePrevWeek={handlePrevWeek}
                  checkThisWeekDates={checkThisWeekDates}
                  currentWeekDates={currentWeekDates}
                />
                <ClassList
                  isLoading={isLoading}
                  error={error}
                  classData={classData}
                  selectedClub={selectedClub}
                  handleOpenModal={handleOpenModal}
                  currentWeekDates={currentWeekDates}
                />
              </>
            )}
          </div>

          {selectedClass && (
            <ClassModal
              selectedClass={selectedClass}
              handleCloseModal={handleCloseModal}
              selectedTrainer={selectedTrainer}
              setSelectedTrainer={setSelectedTrainer}
              fetchTrainerAvailability={fetchTrainerAvailability}
              loadingAvailability={loadingAvailability}
              trainerAvailability={trainerAvailability}
              handleBooking={handleBooking}
            />
          )}
        </div>

        {/* Booking Confirmation Modal */}
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
      </div>
    </>
  );
}
