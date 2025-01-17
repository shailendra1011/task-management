const express = require('express');
const Api = express.Router();
const TaskController = require('../app/Controllers/Api/TaskController');
const AuthController = require('../app/Controllers/Api/AuthController');
const { CheckAuthMiddleware } = require('../app/middleware/checkAuthMiddleware');

//register api route
Api.post('/register', AuthController.register);

//login api route
Api.post('/login', AuthController.login);

//apply middleware on below routes
Api.use(CheckAuthMiddleware);

//create task route
Api.post('/add-task', TaskController.createTask);
//task listing route
Api.get('/tasks', TaskController.taskList);
//update task route
Api.put('/tasks/:taskId', TaskController.updateTask);
//delete task route
Api.delete('/task/:taskId', TaskController.deleteTask);


module.exports = { Api };