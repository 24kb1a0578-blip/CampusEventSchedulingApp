import { useState } from "react";
import { Link } from "react-router-dom";

const sampleEvents = [
  { id: 1, name: "CodeFest 2026", category: "Technical", date: "2026-11-10", venue: "Seminar Hall", seats: 100, fee: 100 },
  { id: 2, name: "Cultural Night", category: "Cultural", date: "2026-11-15", venue: "Main Auditorium", seats: 200, fee: 0 },
  { id: 3, name: "Campus Sports Meet", category: "Sports", date: "2026-11-20", venue: "Sports Ground", seats: 150, fee: 50 },
  { id: 4, name: "Web Development Workshop", category: "Workshop", date: "2026-11-25", venue: "Computer Lab", seats: 60, fee: 75 },
  { id: 5, name: "Research Seminar", category: "Seminar", date: "2026-12-02", venue: "Room 201", seats: 80, fee: 0 },
  { id: 6, name: "Academic Meetup", category: "Academic", date: "2026-12-05", venue: "Lecture Hall", seats: 90, fee: 0 }
];

export { sampleEvents };

export default function EventScheduling() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const events = sampleEvents.filter(event =>
    (category === "All" || event.category === category) &&
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <h1>Event Scheduling</h1>
      <p>Discover and book events happening on campus.</p>

      <input
        placeholder="Search event name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="category-list">
        {["All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Academic"].map(item => (
          <button
            key={item}
            className={category === item ? "button" : "button secondary"}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid">
        {events.map(event => (
          <article className="card" key={event.id}>
            <span className="tag">{event.category}</span>
            <h2>{event.name}</h2>
            <p>📅 {event.date}</p>
            <p>📍 {event.venue}</p>
            <p>Seats: {event.seats}</p>
            <p>Registration fee: ₹{event.fee}</p>
            <Link className="button" to={`/book/${event.id}`}>Book Event</Link>
          </article>
        ))}
        {events.length === 0 && <p>No matching events found.</p>}
      </div>
    </section>
  );
}