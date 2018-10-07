import app from 'express'
import wethaer from '../controllers/weatherController'
import isLogin from '../middlewares/isLogin'

const { getWeatherStatus } = wethaer
const route = app.Router()

route
  .get('/:lat/:lon', isLogin, getWeatherStatus)

export default route
