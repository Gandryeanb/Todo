import app from 'express'
import user from '../controllers/userController'

const { registerWeb, loginWeb } = user
const route = app.Router()

route
  .post('/login/web', loginWeb)
  .post('/register/web', registerWeb)

export default route
