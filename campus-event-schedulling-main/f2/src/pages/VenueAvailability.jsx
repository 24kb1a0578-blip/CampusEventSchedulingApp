const venues = [
  { name: "Main Auditorium", capacity: 200, booked: 120 },
  { name: "Seminar Hall", capacity: 100, booked: 45 },
  { name: "Computer Lab", capacity: 60, booked: 60 },
  { name: "Sports Ground", capacity: 150, booked: 90 }
];

export default function VenueAvailability() {
  return (
    <section>
      <h1>Venue Availability</h1>
      <div className="grid">
        {venues.map(venue => {
          const remaining = venue.capacity - venue.booked;
          return (
            <article className="card" key={venue.name}>
              <h2>{venue.name}</h2>
              <p>Total capacity: {venue.capacity}</p>
              <p>Booked seats: {venue.booked}</p>
              <p>Remaining seats: {remaining}</p>
              <span className="tag">{remaining === 0 ? "FULL" : "Available"}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}