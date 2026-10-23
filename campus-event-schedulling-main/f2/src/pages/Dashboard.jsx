import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    ["12", "Upcoming Events"],
    ["148", "Total Bookings"],
    ["352", "Available Seats"],
    ["5", "Notifications"]
  ];

  return (
    <section>
      <div className="hero">
        <p className="eyebrow">YOUR CAMPUS. YOUR EVENTS.</p>
        <h1>Welcome to CampusConnect</h1>
        <p>Discover campus events, reserve your seat, and stay connected.</p>
        <Link className="button" to="/events">Explore Events →</Link>
      </div>

      <h2>Dashboard Overview</h2>
      <div className="grid stats">
        {stats.map(([number, label]) => (
          <article className="card" key={label}>
            <h2>{number}</h2>
            <p>{label}</p>
          </article>
        ))}
      </div>

      <div className="card">
        <h2>Get Started</h2>
        <p>Browse technical, cultural, sports, and workshop events.</p>
        <Link className="button" to="/events">View Events</Link>
      </div>
    </section>
  );
}