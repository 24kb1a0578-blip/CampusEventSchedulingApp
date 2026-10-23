
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load bookings");
        }
        return response.json();
      })
      .then((data) => {
        // Supports APIs returning either an array or { bookings: [...] }
        const list = Array.isArray(data)
          ? data
          : data.bookings || data.data || [];

        setBookings(list);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <section><h1>My Bookings</h1><p>Loading bookings...</p></section>;

  return (
    <section>
      <h1>My Bookings</h1>
      <p>Total bookings: {bookings.length}</p>

      {error && <p>{error}. Check whether the backend is running.</p>}

      {!error && bookings.length === 0 && (
        <article className="card">
          <p>No bookings found.</p>
          <Link className="button" to="/events">Browse Events</Link>
        </article>
      )}

      {bookings.map((booking) => (
        <article className="card" key={booking.id || booking.booking_record_id || booking.booking_id}>
          <h2>{booking.event_name || booking.eventName || booking.title || "Campus Event"}</h2>
          <p><strong>Booking ID:</strong> {booking.booking_id || booking.bookingId || booking.id}</p>
          <p><strong>Student:</strong> {booking.name || booking.student_name}</p>
          <p><strong>Roll Number:</strong> {booking.roll_no || booking.roll_number}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Event Date:</strong> {booking.event_date || booking.eventDate || "Not specified"}</p>
          <p><strong>Status:</strong> {booking.status || "Pending verification"}</p>
          <p><strong>Registered At:</strong> {booking.registration_time || booking.booked_at || "Not available"}</p>
        </article>
      ))}
    </section>
  );
}
