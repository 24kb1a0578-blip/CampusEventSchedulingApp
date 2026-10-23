import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const isAdmin = sessionStorage.getItem("demoRole") === "admin";

  return (
    <section>
      <h1>Admin Dashboard</h1>
      {isAdmin ? (
        <>
          <div className="grid stats">
            <article className="card"><h2>6</h2><p>Demo Events</p></article>
            <article className="card"><h2>148</h2><p>Demo Bookings</p></article>
            <article className="card"><h2>12</h2><p>Pending Reviews</p></article>
          </div>
          <Link className="button" to="/manage-events">Manage Events</Link>
        </>
      ) : (
        <div className="card">
          <p>Admin demo access only. Log in with the demo admin credentials.</p>
          <Link className="button" to="/login">Go to Login</Link>
        </div>
      )}
    </section>
  );
}