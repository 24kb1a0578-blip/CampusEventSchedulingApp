import { Link } from "react-router-dom";

export default function BookingConfirmation() {
  const booking = JSON.parse(sessionStorage.getItem("campusBooking") || "null");

  if (!booking) {
    return (
      <section className="card">
        <h1>No booking found</h1>
        <Link className="button" to="/events">Browse Events</Link>
      </section>
    );
  }

  return (
    <section className="card">
      <p className="eyebrow">BOOKING DETAILS</p>
      <h1>Booking Submitted ✓</h1>
      <p><strong>Booking ID:</strong> {booking.bookingId}</p>
      <p><strong>Event:</strong> {booking.eventName}</p>
      <p><strong>Student:</strong> {booking.name}</p>
      <p><strong>Roll Number:</strong> {booking.rollNo}</p>
      <p><strong>Registration time:</strong> {booking.registrationTime}</p>
      <p><strong>Payment time:</strong> {booking.paymentTime}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <p className="muted">This is a frontend demo. A real booking requires backend storage and payment verification.</p>
      <Link className="button" to="/my-bookings">My Bookings</Link>
    </section>
  );
}