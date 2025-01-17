const cron = require('node-cron');
const { Task } = require('../../models/mongodb/task');
const sentReminder = require('./sentTaskReminder')
const { Op } = require('sequelize');
var db = require('../../models/mysql/index');
const User = db.User

//schedule cron job at 8AM morning every day 
const task = cron.schedule('0 8 * * *', async () => {
    try {
        const today = new Date();

        // Query MongoDB to find tasks whose dueDate matches today's date
        const tasks = await Task.find({
            dueDate: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999)),
            },
        });

        for (let index = 0; index < tasks.length; index++) {
            const user = await User.findOne({ where: { id: tasks[index].userId } });
            console.log(user);
            if (user) {
                //send task reminder mail of task due date to the users
                sentReminder(user.email)
            }
        }


    } catch (error) {

    }
});

module.exports = task;
