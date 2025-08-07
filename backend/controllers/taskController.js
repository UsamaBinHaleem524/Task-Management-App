const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.userId };
    if (status) query.status = status;

    const tasks = await Task.find(query);
    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      status,
      userId: req.userId,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
