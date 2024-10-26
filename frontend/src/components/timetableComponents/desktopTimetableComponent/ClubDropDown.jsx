// ClubDropdown.jsx
export default function ClubDropdown({ clubs, selectedClub, setSelectedClub }) {
  return (
    <select
      value={selectedClub ? selectedClub.id : ""}
      onChange={(e) => {
        const club = clubs.find((club) => club.id === parseInt(e.target.value, 10));
        setSelectedClub(club);
      }}
      className="select select-bordered w-full max-w-xs"
    >
      <option value="" disabled>
        Choose Club
      </option>
      {clubs.map((club) => (
        <option key={club.id} value={club.id}>
          {club.name}
        </option>
      ))}
    </select>
  );
}
