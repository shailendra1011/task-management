const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const TaskSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'Completed'],
    }
}, {
    timestamps: true
});

TaskSchema.plugin(mongoosePaginate);

const Task = mongoose.model('Tasks', TaskSchema);

module.exports = { Task };
