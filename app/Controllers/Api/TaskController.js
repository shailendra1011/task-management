const { success, failed, validationFailedRes, notFoundMessage } = require('../../Helper/response.js');
const { Validator } = require('node-input-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Task } = require('../../../models/mongodb/task.js');
var db = require('../../../models/mysql/index.js');
const User = db.User

module.exports = {
    addTask: async (req, res) => {
        try {
            const valid = new Validator(req.body, {
                userId: 'required',
                title: 'required',
                description: 'required',
                dueDate: 'required',
                priority: 'required',
                status: 'required'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);
            const user = await User.findOne({ where: { id: req.body.userId } })
            if (!user) {
                return success(res, 'user not found', {});
            }
            await Task.create(req.body);
            return success(res, 'success', {});
        } catch (error) {
            return failed(res, error, 500);
        }
    },
    taskList: async (req, res) => {
        try {
            const valid = new Validator(req.body, {
                userId: 'required'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);
            if (req.headers['authorization'].split(' ')[1]) {
                var token = req.headers['authorization'].split(' ')[1];
                var user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 2;
            const tasks = await Task.paginate({
                userId: user.user_id,
                priority: req.body.priority || { $exists: true },
                status: req.body.status || { $exists: true }
            },
                { page, limit }
            );
            return success(res, 'success', tasks);
        } catch (error) {
            console.log(error);

            return failed(res, error, 500);
        }
    },
    updateTask: async (req, res) => {
        try {
            const valid = new Validator(req.body, {
                priority: 'required',
                status: 'required'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);
            if (req.params.taskId) {
                const task = await Task.findOne({ where: { id: req.params.taskId } })
                if (!task) {
                    return success(res, 'task not found', {});
                }
                await Task.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.taskId) },
                    {
                        priority: req.body.priority,
                        status: req.body.status
                    },
                    { new: true }
                );
                return success(res, 'success', {});
            } else {
                return success(res, 'taskId is mandatory field', {});
            }

        } catch (error) {
            return failed(res, error, 500);
        }
    },
    deleteTask: async (req, res) => {
        try {
            if (req.params.taskId) {
                const task = await Task.findOne({ where: { id: req.params.taskId } })
                if (!task) {
                    return success(res, 'task not found', {});
                }
                await Task.remove({ _id: mongoose.Types.ObjectId(req.params.taskId) });
                return success(res, 'success', {});
            } else {
                return success(res, 'taskId is mandatory field', {});
            }
        } catch (error) {
            return failed(res, error, 500);
        }
    },
}

