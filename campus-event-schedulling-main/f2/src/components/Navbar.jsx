import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">Campus<span>Connect</span></Link>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/events">Events</Link>
        <Link to="/venues">Venues</Link>
        <Link to="/my-bookings">My Bookings</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}