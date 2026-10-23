import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sampleEvents } from "./EventScheduling";

export default function EventBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = sampleEvents.find(item => item.id === Number(id));

  const [form, setForm] = useState({
    name: "", rollNo: "", email: "", college: "", year: "3rd Year",
    transactionId: ""
  });

  if (!event) return <h1>Event not found</h1>;

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();

    if (event.fee > 0 && !form.transactionId.trim()) {
      alert("Enter the transaction ID for this demo booking.");
      return;
    }

    const booking = {
      ...form,
      bookingId: "CC" + Date.now(),
      eventName: event.name,
      eventDate: event.date,
      registrationTime: new Date().toLocaleString(),
      paymentTime: event.fee > 0 ? new Date().toLocaleString() : "Not required",
      status: "Pending verification"
    };

    sessionStorage.setItem("campusBooking", JSON.stringify(booking));
    navigate("/confirmation");
  }

  return (
    <section className="form-card">
      <h1>Book {event.name}</h1>
      <p>Registration fee: ₹{event.fee}</p>
      {event.fee > 0 && (
        <div className="card">
          <h3>Demo QR Payment</h3>
          <p>Payment integration is not connected yet.</p>
          <p>Enter your transaction ID after completing payment through your approved payment method.</p>
        </div>
      )}

      <form onSubmit={submit}>
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={update} required />

        <label>Roll Number</label>
        <input name="rollNo" value={form.rollNo} onChange={update} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={update} required />

        <label>College</label>
        <input name="college" value={form.college} onChange={update} required />

        <label>Year</label>
        <select name="year" value={form.year} onChange={update}>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>

        {event.fee > 0 && (
          <>
            <label>Transaction ID</label>
            <input name="transactionId" value={form.transactionId} onChange={update} required />
          </>
        )}

        <button className="button" type="submit">Confirm Booking</button>
      </form>
    </section>
  );
}