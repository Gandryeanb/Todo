import app from 'express'
import user from '../controllers/userController'

const { registerWeb, loginWeb, loginGoogle, verifyEmail } = user
const route = app.Router()

route
  .post('/login/web', loginWeb)
  .post('/register/web', registerWeb)
  .get('/login/google', loginGoogle)
  .get('/verify/:token', verifyEmail)

export default route
