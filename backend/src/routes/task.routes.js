import express from 'express';
import {createTask,getUserTasks,getSingleTask,updateTask,deleteTask} from '../controllers/task.controller.js';
import authUser from '../middlewares/authUser.middleware.js';

const taskRouter = express.Router();


taskRouter.post('/create-task', authUser, createTask);
taskRouter.get('/get-all-tasks', authUser, getUserTasks);
taskRouter.get('/get-task/:id', authUser, getSingleTask);
taskRouter.put('/update-task/:id', authUser, updateTask);
taskRouter.delete('/delete-task/:id', authUser, deleteTask);

export default taskRouter;
