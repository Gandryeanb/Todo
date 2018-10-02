import User from '../models/userModel'
import errorfilter from '../helpers/errorFilter'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const { errSignUp } = errorfilter

export default {

  loginWeb (req, res) {
    User.find({ email: req.body.email})
      .then(data => {
        if (data.length == 1) {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            let token = jwt.sign({
              id: data[0]._id,
              username: data[0].username,
              fname: data[0].fname,
              email: data[0].email
            }, process.env.HASH_JWT)

            res.status(200).json({
              token: token,
              username: data[0].username
            })
          } else {
            res.status(500).json({
              status: 'failed',
              msg: 'Wrong password or email'
            })
          }
        } else {
          res.status(404).json({
            status: 'failed',
            msg: 'Wrong password or email'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          msg: err.message
        })
      })
  },

  registerWeb (req, res) {
    let newUser = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      username: req. body.username,
      password: req.body.password
    }

    let user = new User(newUser)

    user.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          msg: data
        })
      })
      .catch(err => {
        let errMsg = err.message
        if (err.message.indexOf('User validation failed') != -1) {
          errMsg = errSignUp(err.message.slice(24))
        } else if (err.message.indexOf('E11000') !== -1 && err.message.indexOf('email') !== -1) {
          errMsg = ['Email already taken']
        } else if (err.message.indexOf('E11000') !== -1 && err.message.indexOf('username') !== -1) {
          errMsg = ['Username already taken']
        }
        res.status(500).json({
          status: 'failed',
          msg: errMsg
        })
      })
  }
}