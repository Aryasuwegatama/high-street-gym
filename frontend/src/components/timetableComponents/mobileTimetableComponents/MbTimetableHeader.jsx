// TimetableHeader.jsx
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function TimetableHeader({ activeDate, handlePrevDate, handleNextDate }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg mb-4 flex justify-between items-center">
      <button 
      onClick={handlePrevDate} 
      disabled={activeDate.toDateString() === new Date().toDateString()}
      className={
        activeDate.toDateString() === new Date().toDateString()
          ? "text-gray-300"
          : ""
      }
      >
        <IoIosArrowBack className="h-8 w-8" />
      </button>
      <div className="text-center">
        <p className="text-2xl font-bold">
            {activeDate.toLocaleDateString("en-AU", { weekday: "long" })}
            </p>
        <p className="text-xl">
            {activeDate.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </p>
      </div>
      <button onClick={handleNextDate}>
        <IoIosArrowForward className="h-8 w-8" />
      </button>
    </div>
  );
}
