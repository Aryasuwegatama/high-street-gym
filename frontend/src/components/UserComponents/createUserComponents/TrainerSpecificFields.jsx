import React from "react";
import SelectInput from "./SelectInput";

export default function TrainerSpecificFields({
  activities,
  clubs,
  selectedActivities,
  setSelectedActivities,
  selectedClub,
  setSelectedClub,
  validationErrors,
}) {
  return (
    <>
      <SelectInput
        name="activities"
        label="Assign Activity"
        value={selectedActivities[0] || ""}
        options={activities.map((activity) => ({
          value: activity.activity_id,
          label: activity.activity_name,
        }))}
        onChange={(e) => setSelectedActivities([e.target.value])}
        error={validationErrors.activities}
      />
      <SelectInput
        name="club_id"
        label="Assign Club"
        value={selectedClub}
        options={clubs.map((club) => ({
          value: club.club_id,
          label: club.club_name,
        }))}
        onChange={(e) => setSelectedClub(e.target.value)}
        error={validationErrors.club_id}
      />
    </>
  );
}
