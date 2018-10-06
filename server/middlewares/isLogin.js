import user from '../models/userModel'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  let token = req.headers.token

  if (token) {
    let decoded = jwt.verify(token, process.env.HASH_JWT)
    req.decoded = decoded
    next()
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'you need to login first'
    })
  }
}