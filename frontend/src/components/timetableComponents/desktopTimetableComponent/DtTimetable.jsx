// DesktopTimetable.jsx
import React, { useState, useEffect } from "react";
import Footer from "../../common/Footer";
import TimetableHeader from "./DesktopTimetableHeader";
import ClubDropdown from "./ClubDropDown";
import ClassList from "./ClassList";
import ClassModal from "./ClassModal";
import XMLUploader from "../../XML/XMLUploader";
import * as classes from "../../../api/classes";

const clubs = [
  { id: 1, name: "Ashgrove", location: "Ashgrove" },
  { id: 2, name: "Brisbane City", location: "Brisbane" },
  { id: 3, name: "Chermside", location: "Chermside" },
  { id: 4, name: "Graceville", location: "Graceville" },
  { id: 5, name: "Westlake", location: "Westlake" },
];

export default function DesktopTimetable() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedClub, setSelectedClub] = useState(null);
  const [classData, setClassData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [trainerAvailability, setTrainerAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchClassData = async () => {
      if (!selectedClub) return;
      setIsLoading(true);
      try {
        const data = await classes.getClassesByClub(selectedClub.name);
        setClassData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassData();
  }, [selectedClub]);

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
        trainerName
      );
      setTrainerAvailability(response.booking_count);
    } catch (error) {
      console.error("Failed to fetch trainer availability", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleBooking = async () => {
    try {
      if (!selectedClass || !selectedTrainer) {
        alert("Please select a trainer to book this class.");
        return;
      }

      const result = await classes.bookClass(
        selectedClass.class_id,
        selectedTrainer
      );

      setModalMessage(result.message || "Class booked successfully!");
      setIsModalOpen(true);

      handleCloseModal();
    } catch (error) {
      setModalMessage(
        error.message === "You have already booked this class."
          ? "You have already booked this class."
          : "Failed to book class. Please try again."
      );
      setIsModalOpen(true);
    }
  };

  const handleUploadSuccess = (message) => {
    setModalMessage(message || "XML file uploaded successfully!");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  return (
    <>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-4 items-center p-4 justify-center">
          <div className="xml-uploader-section mb-6">
            <h2 className="text-xl font-semibold mb-2">Import Activities</h2>
            <XMLUploader onUploadSuccess={handleUploadSuccess} />
          </div>

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

        <Footer />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Upload XML</h2>
              <p className="mb-6">{modalMessage}</p>
              <button onClick={closeModal} className="button-secondary-style text-sm ">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
