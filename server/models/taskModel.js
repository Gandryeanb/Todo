import mongoose from 'mongoose'
import User from './userModel'

const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title required']
  },
  description: {
    type: String,
    required: [true, 'description required']
  },
  dueDate: Date,
  priority: {
    type: Number,
    default: 1
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
  
})

taskSchema.post('save',doc => {
  User.updateOne({ _id: doc.userId }, {$push: {taskId: doc._id}})
    .then(data => {

    })
    .catch(err => {
      throw new Error('error when create user task')
    })
})


const Task = mongoose.model('Task', taskSchema)

export default Task