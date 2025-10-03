const express = require("express");
const Tracker = require("../models/personalModels");
const router = express.Router();

// ✅ Add Transaction
router.post("/addTransaction", async (req, res) => {
  try {
    const { date, description, amount, category } = req.body;

    const transaction = await Tracker.create({
      date,
      description,
      category,
      amount,
      id: req.user ? req.user.id : null, // agar auth use karna ho
    });

    res.status(200).json(transaction); // ✅ direct transaction bhejna
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ View Transactions
router.get("/viewTransaction", async (req, res) => {
  try {
    const transactions = await Tracker.find(
      req.user ? { id: req.user.id } : {}
    );
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
