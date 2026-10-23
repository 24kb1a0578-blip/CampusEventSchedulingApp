import { useState } from "react";
import { sampleEvents } from "./EventScheduling";

export default function ManageEvents() {
  const [events, setEvents] = useState(sampleEvents);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Technical");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [seats, setSeats] = useState(50);
  const [fee, setFee] = useState(0);

  function addEvent(e) {
    e.preventDefault();
    setEvents([...events, {
      id: Date.now(),
      name,
      category,
      date,
      venue,
      seats: Number(seats),
      fee: Number(fee)
    }]);
    setName("");
    setDate("");
    setVenue("");
    setSeats(50);
    setFee(0);
  }

  function deleteEvent(id) {
    setEvents(events.filter(event => event.id !== id));
  }

  return (
    <section>
      <h1>Manage Events</h1>
      {sessionStorage.getItem("demoRole") !== "admin" ? (
        <article className="card">
          <p>Log in as admin to use this demo page.</p>
        </article>
      ) : (
        <>
          <form className="card" onSubmit={addEvent}>
            <h2>Add Event</h2>
            <label>Event Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Academic", "Other"].map(item =>
                <option key={item}>{item}</option>
              )}
            </select>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <label>Venue</label>
            <input value={venue} onChange={e => setVenue(e.target.value)} required />
            <label>Capacity</label>
            <input type="number" min="1" value={seats} onChange={e => setSeats(e.target.value)} required />
            <label>Fee (₹)</label>
            <input type="number" min="0" value={fee} onChange={e => setFee(e.target.value)} required />
            <button className="button">Add Event</button>
          </form>

          <h2>Existing Events</h2>
          <div className="grid">
            {events.map(event => (
              <article className="card" key={event.id}>
                <h3>{event.name}</h3>
                <p>{event.category} · {event.date}</p>
                <p>{event.venue} · ₹{event.fee}</p>
                <button className="button danger" onClick={() => deleteEvent(event.id)}>Delete</button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}