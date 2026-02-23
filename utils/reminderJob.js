import cron from "node-cron";
import Task from "../models/Task.js";
import User from "../models/User.js";
import sendEmail from "./sendEmail.js";

const startReminderJob = () => {
  // Runs every hour at minute 0
  cron.schedule("* * * * *", async () => {
    console.log("Running reminder job...");
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    try {
      const tasks = await Task.find({
        deadline: { $gte: now, $lte: nextHour },
        status: "Pending",
        reminderSent: false
      }).populate("user");
      for (const task of tasks) {
        await sendEmail(
          task.user.email,
          "Task Deadline Reminder",
          `Reminder: Your task \"${task.title}\" is due soon.`
        );
        task.reminderSent = true;
        await task.save();
        console.log(`Reminder sent for task: ${task.title}`);
      }
    } catch (error) {
      console.error("Reminder job error:", error);
    }
  });
};

export default startReminderJob;
