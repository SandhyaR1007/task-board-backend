const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Task = require("../models/taskModel");
const taskRouter = express.Router();

taskRouter.post("/", async (req, res) => {
  try {
    const task = await Task.create({
      id: uuidv4(),
      title: "Task 3",
      summary: "Summary for Task 3",
      assignee: "Pete",
      date: new Date(),
      priority: "High",
    });
    if (task) {
      res.status(201).json({ messgae: "task created successfully" });
    } else {
      res.status(401).json({ message: "some error occurred" });
    }
  } catch (err) {
    res.status(500).json({ message: "some error occurred", err });
  }
});
taskRouter.get("/", async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).send(tasks);
});

module.exports = taskRouter;
