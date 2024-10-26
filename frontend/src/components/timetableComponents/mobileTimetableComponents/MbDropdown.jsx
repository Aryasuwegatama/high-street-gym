// ClubDropdown.jsx
export default function ClubDropdown({ clubs, selectedClub, setSelectedClub }) {
    return (
      <div className="form-control p-2">
        <select
          value={selectedClub ? selectedClub.id : ""}
          onChange={(e) => {
            const selectedClubId = parseInt(e.target.value, 10);
            const foundClub = clubs.find((club) => club.id === selectedClubId);
            setSelectedClub(foundClub);
          }}
          className="select select-bordered"
        >
          <option value="" disabled selected>
            Choose Club
          </option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
      </div>
      
    );
  }
  