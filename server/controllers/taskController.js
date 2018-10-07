import User from '../models/userModel'
import Task from '../models/taskModel'
import sorter from '../helpers/sortByDate'

export default {

  createTask (req, res) {

    if (req.body.priority > 5) {
      req.body.priority = 5
    } else if ( req.body.priority < 1) {
      req.body.priority = 1
    } else if (req.body.priority != Number) {
      req.body.priority = 1
    }

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
    
    if (req.body.priority > 5) {
      req.body.priority = 5
    } else if ( req.body.priority < 1) {
      req.body.priority = 1
    } else if (req.body.priority != Number) {
      req.body.priority = 1
    }

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

    Task.deleteOne({ _id: req.params.id, userId: req.decoded.id })
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
        data = sorter(data, req.params.sort)
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
  solvingTask(req, res) {

    Task.updateOne({ _id: req.params.id, userId: req.decoded.id }, { done: 1 })
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'success when updating task'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when updating done task'
        })
      })
  }
}