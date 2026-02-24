import Task from "../models/Task.js";

/* ---------------- CREATE TASK ---------------- */
export const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    const task = await Task.create({
      title,
      description,
      deadline,
      priority,
      user: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET TASKS (WITH FILTERING & SORTING) ---------------- */
export const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;
    let filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    let sortOption = {};
    if (sortBy === "deadline") sortOption.deadline = 1;
    if (sortBy === "priority") sortOption.priority = 1;
    if (sortBy === "createdAt") sortOption.createdAt = -1;
    const tasks = await Task.find(filter).sort(sortOption);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE TASK ---------------- */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.body.status) {
      task.status = req.body.status;

      if (req.body.status === "Completed") {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }

    if (req.body.title) task.title = req.body.title;
    if (req.body.deadline) task.deadline = req.body.deadline;
    if (req.body.priority) task.priority = req.body.priority;

    const updatedTask = await task.save();

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE TASK ---------------- */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
