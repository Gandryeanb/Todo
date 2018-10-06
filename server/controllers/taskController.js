import User from '../models/userModel'
import Task from '../models/taskModel'

export default {

  createTask (req, res) {

    let data = {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      userId: req.decoded.id
    }
    let task = new Task(data)

    task.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'creating data success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'creating task failed',
          err: err.message
        })
      })

  },
  updateTask (req, res) {
    
    Task.updateOne({ _id: req.params.id, userId: req.decoded.id },{
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority
    })
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: `updating data with id ${req.params.id} success`
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: `updating data with id ${req.params.id} failed`
        })
      })
  },
  removeTask (req, res) {

    Task.removeOne({ _id: req.params.id, userId: req.decoded.id })
      .then(data => {
        User.updateOne({ _id: req.decoded.id }, {$pull :{taskId: req.params.id}})
          .then(data => {
            res.status(200).json({
              status: 'success',
              message: `success deleting task with Id ${req.params.id}`
            })
          })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: `failed when deleting task with id ${req.params.id}`
        })
      })
  },
  getTask (req, res) {

    Task.find({ userId: req.decoded.id })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when getting data from database'
        })
      })
  },
}