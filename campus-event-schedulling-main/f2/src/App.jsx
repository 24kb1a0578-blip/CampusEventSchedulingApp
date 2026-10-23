import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventScheduling from "./pages/EventScheduling";
import EventBooking from "./pages/EventBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import VenueAvailability from "./pages/VenueAvailability";
import StudentOrganizer from "./pages/StudentOrganizer";
import MyBookings from "./pages/MyBookings";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageEvents from "./pages/ManageEvents";


export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventScheduling />} />
          <Route path="/book/:id" element={<EventBooking />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/venues" element={<VenueAvailability />} />
          <Route path="/organizers" element={<StudentOrganizer />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
        </Routes>
      </main>
    </>
  );
}