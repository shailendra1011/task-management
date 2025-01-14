const express = require('express');
const Api = express.Router();
const TaskController = require('../app/Controllers/Api/TaskController');
const AuthController = require('../app/Controllers/Api/AuthController');
const { CheckAuthMiddleware } = require('../app/middleware/checkAuthMiddleware');


Api.post('/register', AuthController.register);
Api.post('/login', AuthController.login);

Api.use(CheckAuthMiddleware);
Api.post('/add-task', TaskController.addTask);
Api.get('/tasks', TaskController.taskList);
Api.put('/tasks/:taskId', TaskController.updateTask);
Api.delete('/tasks/:taskId', TaskController.deleteTask);
module.exports = { Api };