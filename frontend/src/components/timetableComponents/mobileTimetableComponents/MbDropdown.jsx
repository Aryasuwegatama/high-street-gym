export default function ClubDropdown({ clubs, selectedClub, setSelectedClub }) {
  return (
    <div className="form-control p-2">
      <select
        value={selectedClub ? selectedClub.club_id : ""}
        onChange={(e) => {
          const selectedClubId = parseInt(e.target.value, 10);
          const foundClub = clubs.find((club) => club.club_id === selectedClubId);
          setSelectedClub(foundClub);
        }}
        className="select select-bordered"
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
    </div>
  );
}
