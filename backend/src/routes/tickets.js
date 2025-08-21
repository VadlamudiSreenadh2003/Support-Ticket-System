const express = require("express");
const Ticket = require("../models/Ticket");
const { triageTicket } = require("../utils/triageAgent");
const router = express.Router();

// Create Ticket + run AI triage
router.post("/", async (req, res) => {
  try {
    const { userId, subject, description } = req.body;

    if (!userId || !subject || !description) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let ticket = new Ticket({ user: userId, subject, description });

    ticket = await triageTicket(ticket);
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error("Error creating ticket:", err); // <-- helpful for debugging
    res.status(500).json({ error: err.message });
  }
});

// Get all tickets
router.get("/", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

module.exports = router;
