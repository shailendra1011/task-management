const { success, failed, validationFailedRes, notFoundMessage } = require('../../Helper/response.js');
const { Validator } = require('node-input-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Task } = require('../../../models/mongodb/task.js');
var db = require('../../../models/mysql/index.js');
const User = db.User
const { jwtDecode } = require("jwt-decode");


module.exports = {
    //create task function
    createTask: async (req, res) => {
        try {
            //check validation 
            const valid = new Validator(req.body, {
                userId: 'required',
                title: 'required',
                description: 'required',
                dueDate: 'required',
                priority: 'required|in:Low,Medium,High',
                status: 'required|in:Pending,In Progress,Completed'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);
            //check user is exist or not
            const user = await User.findOne({ where: { id: req.body.userId } })
            if (!user) {
                return notFoundMessage(res, 'user not found', {});
            }
            //create task
            await Task.create(req.body);
            return success(res, 'success', {});
        } catch (error) {
            return failed(res, error, 500);
        }
    },

    //task list function
    taskList: async (req, res) => {
        try {
            if (req.headers['authorization'].split(' ')[1]) {

                //get logged in user data from jwt token
                var user = jwtDecode(req.headers['authorization'].split(' ')[1]);
                if (user.user_id) {
                    //set page and limit for pagination
                    const page = parseInt(req.query.page) || 1;
                    const limit = parseInt(req.query.limit) || 10;

                    //get all tasks by using filters (userId,priority,status)
                    const tasks = await Task.paginate({
                        userId: user.user_id,
                        priority: req.body.priority || { $exists: true },
                        status: req.body.status || { $exists: true }
                    },
                        { page, limit }
                    );
                    return success(res, 'success', tasks);
                } else {
                    return notFoundMessage(res, 'user not found', {});
                }
            } else {
                return notFoundMessage(res, 'token not found', {});
            }
        } catch (error) {
            return failed(res, error, 500);
        }
    },
    updateTask: async (req, res) => {
        try {
            const valid = new Validator(req.body, {
                priority: 'required|in:Low,Medium,High',
                status: 'required|in:Pending,In Progress,Completed'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);

            if (req.headers['authorization'].split(' ')[1]) {
                //get logged in user data from jwt token
                var user = jwtDecode(req.headers['authorization'].split(' ')[1]);
                if (req.params.taskId && user.user_id) {
                    //check task is exist or not 
                    const task = await Task.findOne({ where: { _id: mongoose.Types.ObjectId(req.params.taskId), userId: user.user_id } })
                    if (!task) {
                        return notFoundMessage(res, 'Task not found', {});
                    }
                    //update priority and status of task
                    await Task.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.taskId), userId: user.user_id },
                        {
                            priority: req.body.priority,
                            status: req.body.status
                        },
                        { new: true }
                    );
                    return success(res, 'success', {});
                } else {
                    return success(res, 'taskId and userId is mandatory field', {});
                }
            } else {
                return notFoundMessage(res, 'token not found', {});
            }

        } catch (error) {
            return failed(res, error, 500);
        }
    },
    deleteTask: async (req, res) => {
        try {
            if (req.headers['authorization'].split(' ')[1]) {
                //get logged in user data from jwt token
                var user = jwtDecode(req.headers['authorization'].split(' ')[1]);
                if (req.params.taskId && user.user_id) {
                    //check task is exist or not 
                    const task = await Task.findOne({ where: { _id: mongoose.Types.ObjectId(req.params.taskId), userId: user.user_id } })
                    if (!task) {
                        return notFoundMessage(res, 'task not found', {});
                    }
                    //delete task 
                    await Task.deleteOne({ _id: mongoose.Types.ObjectId(req.params.taskId) });
                    return success(res, 'success', {});
                } else {
                    return success(res, 'taskId and userId is mandatory field', {});
                }
            } else {
                return notFoundMessage(res, 'token not found', {});
            }
        } catch (error) {
            return failed(res, error, 500);
        }
    },
}

