import app from 'express'
import user from '../controllers/userController'

const { registerWeb, loginWeb } = user
const route = app.Router()

route
  .post('/loginweb', loginWeb)
  .post('/registerweb', registerWeb)

export default route
