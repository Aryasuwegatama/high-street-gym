export default function ClubDropdown({ clubs, selectedClub, setSelectedClub }) {
  return (
    <select
      value={selectedClub ? selectedClub.club_id : ""}
      onChange={(e) => {
        const club = clubs.find(
          (club) => club.club_id === parseInt(e.target.value, 10)
        );
        setSelectedClub(club);
      }}
      className="select select-bordered w-full max-w-xs"
    >
      <option value="" disabled>
        Choose Club
      </option>
      {clubs.map((club) => (
        <option key={club.club_id} value={club.club_id}>
          {club.club_name}
        </option>
      ))}
    </select>
  );
}
