//modules
const cron = require("node-cron");
const updateLeaderboard = require("./updateLeaderboards");

//schedule the job to run once a day at midnight (00:00)
cron.schedule("46 5 * * *", async () => {
  console.log("Running daily leaderboard update...");
  await updateLeaderboard();
});
