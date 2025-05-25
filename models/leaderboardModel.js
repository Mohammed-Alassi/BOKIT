//modules
const mongoose = require("mongoose");

//schema definition for a single leaderboard type (e.g., "goals", "mvp", etc.)
const leaderboardSchema = new mongoose.Schema({
  //type of stat the leaderboard tracks
  type: {
    type: String,
    enum: ["wins", "mvp", "goals", "assists", "interceptions", "cleanSheets"],
    required: true,
    unique: true,
  },

  //top 50 players for this stat type
  topPlayers: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      statValue: { type: Number, default: 0 },
      matches: { type: Number, default: 0 },
    },
  ],
});

//export the model
const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
module.exports = Leaderboard;
