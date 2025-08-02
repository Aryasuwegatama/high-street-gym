import { PiDotsThreeCircleVertical } from "react-icons/pi";

export default function ClassCard({
  day,
  handleOpenModal,
  dayClasses,
  isPastDay,
}) {
  return (
    <div key={day.toISOString()} className="flex flex-col gap-2">
      {dayClasses.map((classItem) => (
        <div
          key={classItem.class_id}
          className={`card bg-base-100 shadow-xl p-3 ${
            isPastDay ? "bg-gray-100 text-gray-400" : "bg-base-100"
          }`}
        >
          <h3 className="text-xs font-bold">{classItem.activity_name}</h3>
          <hr className="my-1" />
          <p className="text-xs font-semibold">{classItem.class_time}</p>
          <p className="text-xs">{classItem.activity_duration} Minutes</p>
          <p className="text-xs">{classItem.club_name}</p>
          <hr className="border my-2" />
          <button
            className="flex text-xs p-0 text-info "
            disabled={isPastDay}
            onClick={() => handleOpenModal(classItem)}
          >
            <PiDotsThreeCircleVertical className="h-4 w-4 mr-2 hidden lg:flex" />
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
