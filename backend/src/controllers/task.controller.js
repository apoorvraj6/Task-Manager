import {Task} from "../models/task.model.js";


const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const userId = req.userId;

    if ([title, dueDate].some(field => field?.trim() === "")) {
      return res.json({ success: false, message: "Title and due date are required." });
    }

    
    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime())) {
      return res.json({ success: false, message: "Invalid due date format." });
    }

    
    const now = new Date();
    if (dueDateObj < now.setHours(0, 0, 0, 0)) {
      return res.json({ success: false, message: "Due date cannot be in the past." });
    }

    const task = await Task.create({
      user: userId,
      title,
      description,
      dueDate: dueDateObj,
      priority,
    });

    res.json({ success: true, task });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const getUserTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ user: userId }).sort({ dueDate: 1 });

    res.json({ success: true, tasks });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};





const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description, dueDate, priority, status } = req.body;

    
    if (dueDate) {
      const dueDateObj = new Date(dueDate);

      if (isNaN(dueDateObj.getTime())) {
        return res.json({ success: false, message: "Invalid due date format." });
      }

      const now = new Date();
      now.setHours(0, 0, 0, 0); 

      if (dueDateObj < now) {
        return res.json({ success: false, message: "Due date cannot be in the past." });
      }
    }

    const updateFields = { title, description, priority, status };
    if (dueDate) updateFields.dueDate = new Date(dueDate); 

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true }
    );

    if (!task)
      return res.json({ success: false, message: "Task not found or not authorized." });

    res.json({ success: true, task });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!task)
      return res.json({ success: false, message: "Task not found or not authorized." });

    res.json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
};
