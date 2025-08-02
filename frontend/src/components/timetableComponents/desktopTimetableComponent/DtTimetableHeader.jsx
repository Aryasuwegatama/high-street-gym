import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function TimetableHeader({
  handleNextWeek,
  handlePrevWeek,
  checkThisWeekDates,
  currentWeekDates,
}) {
  return (
    <div className="w-full bg-base-200 p-4 rounded-lg mb-4 flex justify-between items-center relative">
      <button onClick={handlePrevWeek} disabled={checkThisWeekDates}>
        <IoIosArrowBack
          className={`h-8 w-8 ${checkThisWeekDates ? "text-gray-300" : ""}`}
        />
      </button>

      {/* Week View (Always show 7 days) */}
      <div className="flex gap-2 flex-1 px-4">
        {currentWeekDates.map((day, index) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const isPastDay = day < new Date().setHours(0, 0, 0, 0);

          return (
            <div
              key={index}
              className={`w-full text-center cursor-pointer p-2 rounded-lg ${
                isToday ? "bg-info text-white" : "bg-base-100"
              } ${isPastDay ? "text-gray-300" : ""}`}
            >
              <p className="text-lg font-semibold">
                {day.toLocaleDateString("en-AU", { weekday: "short" })}
              </p>
              <p className="text-lg">
                {day.toLocaleDateString("en-AU", { day: "numeric" })}
              </p>
            </div>
          );
        })}
      </div>

      <button onClick={handleNextWeek} className="flex-2">
        <IoIosArrowForward className="h-8 w-8" />
      </button>
    </div>
  );
}
