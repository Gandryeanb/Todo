import app from 'express'
import task from '../controllers/taskController'
import isLogin from '../middlewares/isLogin'

const { createTask, updateTask, getTask, removeTask, solvingTask} = task
const route = app.Router()

route
  .get('/:sort', isLogin, getTask)
  .post('/', isLogin, createTask)
  .put('/:id', isLogin, updateTask)
  .put('/done/:id', isLogin, solvingTask)
  .delete('/:id', isLogin, removeTask)

export default route
