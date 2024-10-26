// MobileTimetable.jsx
import React, { useState, useEffect } from "react";
import * as classes from "../../../api/classes";
import ClubDropdown from "./MbDropdown";
import TimetableHeader from "./MbTimetableHeader";
import ClassList from "./MbClassList";
import ClassModal from "./MbClassModal";

const clubs = [
  { id: 1, name: "Ashgrove", location: "Ashgrove" },
  { id: 2, name: "Brisbane City", location: "Brisbane" },
  { id: 3, name: "Chermside", location: "Chermside" },
  { id: 4, name: "Graceville", location: "Graceville" },
  { id: 5, name: "Westlake", location: "Westlake" },
];

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

  useEffect(() => {
    const fetchClassData = async () => {
      if (!selectedClub) return;
      setIsLoading(true);
      setError(null);
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
    return classData.filter((classItem) => {
      const classTimeHour =
        classItem.class_time && typeof classItem.class_time === "string"
          ? parseInt(classItem.class_time.split(":")[0], 10)
          : null;
      return (
        classItem.class_date === formattedActiveDate &&
        timeFilter(classTimeHour) &&
        classItem.club_name === selectedClub.name
      );
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
        trainerName
      );
      setTrainerAvailability(response.booking_count);
    } catch (error) {
      console.error("Failed to fetch trainer availability", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Function to handle booking a class with the selected trainer
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

      if (!result.success) {
        if (result.message === "You have already booked this class.") {
          alert("You have already booked this class.");
        } else if (
          result.message ===
          "This class with the selected trainer is fully booked."
        ) {
          alert("This class is fully booked. Please choose another class.");
        } else {
          alert(result.message);
        }
      } else {
        alert("Class booked successfully!");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error booking class:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // console.log(selectedTrainer)
  // console.log(selectedClass.class_id)

  return (
    <>
      <ClubDropdown clubs={clubs} selectedClub={selectedClub} setSelectedClub={setSelectedClub} />
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

      <div className="container mx-auto p-2 pb-20">
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
      />
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
    </>
  );
}
