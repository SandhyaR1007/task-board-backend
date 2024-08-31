const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");

const Task = require("../models/taskModel");
const taskRouter = express.Router();

const taskSchema = z.object({
  title: z.string(),
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

module.exports = taskRouter;
