
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "5mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusConnect backend is running"
  });
});

// Test SQLite connection
app.get("/api/db-test", (req, res) => {
  try {
    const result = db.prepare("SELECT 1 AS connected").get();

    res.json({
      success: true,
      message: "SQLite connected successfully",
      database: "campusconnect.db",
      connected: result.connected === 1
    });
  } catch (error) {
    console.error("Database test failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not connect to SQLite."
    });
  }
});

// Get all events
app.get("/api/events", (req, res) => {
  try {
    const events = db.prepare(`
      SELECT
        id,
        title AS name,
        category,
        event_date,
        venue,
        capacity AS seats,
        booked_seats,
        (capacity - booked_seats) AS available_seats,
        price AS fee,
        created_at
      FROM events
      ORDER BY event_date ASC, id ASC
    `).all();

    res.json(events);
  } catch (error) {
    console.error("Get events failed:", error.message);
    res.status(500).json({ message: "Failed to fetch events." });
  }
});

// Get one event
app.get("/api/events/:id", (req, res) => {
  try {
    const event = db.prepare(`
      SELECT *,
        title AS name,
        capacity AS seats,
        price AS fee,
        (capacity - booked_seats) AS available_seats
      FROM events
      WHERE id = ?
    `).get(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json(event);
  } catch (error) {
    console.error("Get event failed:", error.message);
    res.status(500).json({ message: "Failed to fetch event." });
  }
});

// Add an event
app.post("/api/events", (req, res) => {
  const {
    name,
    category,
    event_date,
    venue,
    seats,
    fee = 0
  } = req.body;

  const capacity = Number(seats);
  const eventFee = Number(fee);

  if (
    !name?.trim() ||
    !category?.trim() ||
    !event_date ||
    !venue?.trim() ||
    !Number.isInteger(capacity) ||
    capacity < 1 ||
    !Number.isFinite(eventFee) ||
    eventFee < 0
  ) {
    return res.status(400).json({
      message: "Enter a name, category, date, venue, positive seat capacity, and valid fee."
    });
  }

  try {
    const result = db.prepare(`
      INSERT INTO events
        (title, category, event_date, venue, capacity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      category.trim(),
      event_date,
      venue.trim(),
      capacity,
      eventFee
    );

    res.status(201).json({
      message: "Event created successfully.",
      id: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error("Create event failed:", error.message);
    res.status(500).json({ message: "Failed to create event." });
  }
});

// Edit an event
app.put("/api/events/:id", (req, res) => {
  const {
    name,
    category,
    event_date,
    venue,
    seats,
    fee
  } = req.body;

  const capacity = Number(seats);
  const eventFee = Number(fee);

  if (
    !name?.trim() ||
    !category?.trim() ||
    !event_date ||
    !venue?.trim() ||
    !Number.isInteger(capacity) ||
    capacity < 1 ||
    !Number.isFinite(eventFee) ||
    eventFee < 0
  ) {
    return res.status(400).json({
      message: "Enter valid event details."
    });
  }

  try {
    const existing = db.prepare(
      "SELECT id, booked_seats FROM events WHERE id = ?"
    ).get(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (capacity < existing.booked_seats) {
      return res.status(400).json({
        message: "Capacity cannot be less than existing bookings."
      });
    }

    db.prepare(`
      UPDATE events
      SET title = ?,
          category = ?,
          event_date = ?,
          venue = ?,
          capacity = ?,
          price = ?
      WHERE id = ?
    `).run(
      name.trim(),
      category.trim(),
      event_date,
      venue.trim(),
      capacity,
      eventFee,
      req.params.id
    );

    res.json({ message: "Event updated successfully." });
  } catch (error) {
    console.error("Update event failed:", error.message);
    res.status(500).json({ message: "Failed to update event." });
  }
});

// Delete an event only if it has no bookings
app.delete("/api/events/:id", (req, res) => {
  try {
    const event = db.prepare(
      "SELECT id FROM events WHERE id = ?"
    ).get(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const bookings = db.prepare(
      "SELECT COUNT(*) AS count FROM bookings WHERE event_id = ?"
    ).get(req.params.id);

    if (bookings.count > 0) {
      return res.status(409).json({
        message: "This event has bookings and cannot be deleted."
      });
    }

    db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);

    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Delete event failed:", error.message);
    res.status(500).json({ message: "Failed to delete event." });
  }
});

// Register a student for an event
app.post("/api/bookings", (req, res) => {
  const {
    event_id,
    name,
    roll_no,
    email,
    college,
    year,
    transaction_id = ""
  } = req.body;

  if (
    !event_id ||
    !name?.trim() ||
    !roll_no?.trim() ||
    !email?.trim() ||
    !college?.trim() ||
    !year?.toString().trim()
  ) {
    return res.status(400).json({
      message: "Fill in all required student and event details."
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({
      message: "Enter a valid email address."
    });
  }

  if (
    typeof transaction_id !== "string" ||
    transaction_id.length > 100
  ) {
    return res.status(400).json({
      message: "Invalid transaction ID."
    });
  }

  try {
    // A transaction prevents two simultaneous requests from
    // exceeding the event's available capacity.
    const createBooking = db.transaction(() => {
      const event = db.prepare(`
        SELECT id, capacity, booked_seats
        FROM events
        WHERE id = ?
      `).get(event_id);

      if (!event) {
        const error = new Error("Event not found.");
        error.status = 404;
        throw error;
      }

      if (event.booked_seats >= event.capacity) {
        const error = new Error(
          "This event is full. No seats are available."
        );
        error.status = 409;
        throw error;
      }

      const bookingId =
        "CC-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        crypto.randomBytes(3).toString("hex").toUpperCase();

      const result = db.prepare(`
        INSERT INTO bookings
          (event_id, student_name, roll_number, email, college,
           year, transaction_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        event_id,
        name.trim(),
        roll_no.trim(),
        email.trim(),
        college.trim(),
        year.toString().trim(),
        transaction_id.trim(),
        "Pending verification"
      );

      db.prepare(`
        UPDATE events
        SET booked_seats = booked_seats + 1
        WHERE id = ?
      `).run(event_id);

      return {
        bookingId,
        recordId: Number(result.lastInsertRowid)
      };
    });

    const result = createBooking();

    res.status(201).json({
      message: "Booking registered successfully.",
      booking_id: result.bookingId,
      booking_record_id: result.recordId,
      status: "Pending verification",
      registration_time: new Date().toISOString()
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        message: error.message
      });
    }

    console.error("Create booking failed:", error.message);
    res.status(500).json({
      message: "Failed to create booking."
    });
  }
});

// Get bookings, optionally filtered by event or email
app.get("/api/bookings", (req, res) => {
  try {
    const { event_id, email } = req.query;

    let sql = `
      SELECT
        b.id,
        'CC-' || b.id AS booking_id,
        b.event_id,
        b.student_name AS name,
        b.roll_number AS roll_no,
        b.email,
        b.college,
        b.year,
        b.transaction_id,
        b.status,
        b.booked_at AS registration_time,
        CASE
          WHEN b.status = 'Confirmed' THEN b.booked_at
          ELSE NULL
        END AS payment_time,
        e.title AS event_name,
        e.category,
        e.event_date,
        e.venue
      FROM bookings b
      JOIN events e ON e.id = b.event_id
    `;

    const conditions = [];
    const params = [];

    if (event_id) {
      conditions.push("b.event_id = ?");
      params.push(event_id);
    }

    if (email) {
      conditions.push("b.email = ?");
      params.push(email);
    }

    if (conditions.length) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY b.booked_at DESC, b.id DESC";

    const bookings = db.prepare(sql).all(...params);

    res.json(bookings);
  } catch (error) {
    console.error("Get bookings failed:", error.message);
    res.status(500).json({
      message: "Failed to fetch bookings."
    });
  }
});

// Update booking status
app.patch("/api/bookings/:id/status", (req, res) => {
  const allowedStatuses = [
    "Pending verification",
    "Confirmed",
    "Rejected"
  ];

  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Status must be Pending verification, Confirmed, or Rejected."
    });
  }

  try {
    const result = db.prepare(`
      UPDATE bookings
      SET status = ?
      WHERE id = ?
    `).run(status, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Booking not found."
      });
    }

    res.json({
      message: "Booking status updated.",
      status
    });
  } catch (error) {
    console.error("Update booking status failed:", error.message);
    res.status(500).json({
      message: "Failed to update booking status."
    });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found."
  });
});

// Handle unexpected errors
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message: "Internal server error."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`CampusConnect backend running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Database test: http://localhost:${PORT}/api/db-test`);
});
