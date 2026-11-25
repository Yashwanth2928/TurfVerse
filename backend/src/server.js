
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Backend test
app.get("/", (req, res) => {
  res.send("Welcome to TurfVerse Backend! Server is running.");
});

// Supabase database test
app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("turfs")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: "TurfVerse connected to Supabase successfully!",
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all active turfs
app.get("/api/turfs", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("turfs")
      .select("*")
      .eq("is_active", true);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create a booking
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      user_id,
      turf_id,
      start_time,
      total_price
    } = req.body;

    if (!turf_id || !start_time || total_price == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details"
      });
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user_id || null,
          turf_id,
          start_time,
          total_price,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data
    });
  } catch (error) {
    console.error("Booking error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`TurfVerse server running on http://localhost:${PORT}`);
});
