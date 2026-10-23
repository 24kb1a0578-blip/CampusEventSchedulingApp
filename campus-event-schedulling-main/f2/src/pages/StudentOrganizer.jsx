export default function StudentOrganizer() {
  return (
    <section>
      <h1>Students & Organizers</h1>
      <div className="grid">
        <article className="card">
          <h2>Student View</h2>
          <p>Browse events, submit bookings, and check booking status.</p>
        </article>
        <article className="card">
          <h2>Organizer View</h2>
          <p>Review registrations and coordinate event schedules.</p>
        </article>
      </div>
      <p className="muted">Connect this page to the backend to display real registered students.</p>
    </section>
  );
}