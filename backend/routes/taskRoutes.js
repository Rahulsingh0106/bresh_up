const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// ✅ Create Task
router.post("/tasks", async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: "Task creation failed" });
    }
});

// ✅ Get All Tasks
router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
});

// ✅ Update Task
router.put("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        await task.update(req.body);
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: "Error updating task" });
    }
});

// ✅ Delete Task
router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        await task.destroy();
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

module.exports = router;
