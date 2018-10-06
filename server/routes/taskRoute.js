import app from 'express'
import task from '../controllers/taskController'

const { createTask, updateTask, getTask, removeTask } = task
const route = app.Router()

route
  .get('/', getTask)
  .post('/', createTask)
  .put('/:id', updateTask)
  .delete('/:id', removeTask)

export default route
