const mongoose = require("mongoose");

const personalSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const Tracker = mongoose.model("Tracker", personalSchema);

module.exports = Tracker;
