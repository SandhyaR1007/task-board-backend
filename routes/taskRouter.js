const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");

const Task = require("../models/taskModel");
const taskRouter = express.Router();

const taskSchema = z.object({
  name: z.string(),
  summary: z.string(),
  assignee: z.string(),
  priority: z.string(),
});

taskRouter.post("/", async (req, res) => {
  try {
    const result = taskSchema.safeParse(req.body);
    if (result.success) {
      const task = await Task.create({
        id: uuidv4(),
        date: new Date(),
        ...req.body,
      });
      if (task) {
        res.status(201).json({ message: "task created successfully" });
      } else {
        res.status(400).json({ message: "Failed to add task" });
      }
    } else {
      res.status(400).json({ message: "Invalid Input" });
    }
  } catch (error) {
    res.status(500).json({ message: "some error occurred", error });
  }
});
taskRouter.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).json({ message: "some error occurred", error });
  }
});
taskRouter.put("/updateStatus", async (req, res) => {
  const id = req.query.id;
  const newStatus = req.body.status;
  if (!id) {
    res.status(400).json({ error: "ID is required" });
  }
  if (!newStatus) {
    res.status(400).json({ error: "Status is required" });
  }
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id },
      {
        $set: { status: newStatus },
      },
      { new: true }
    );
    if (updatedTask) {
      res.status(200).json({ message: "Task updated", updatedTask });
    } else {
      res.status(400).json({ error: "Invalid Id" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = taskRouter;
