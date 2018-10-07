import app from 'express'
import quote from '../controllers/quoteController'
import isLogin from '../middlewares/isLogin'

const { getQuote } = quote
const route = app.Router()

route
  .get('/', isLogin, getQuote)

export default route
