import User from '../models/userModel'
import errorfilter from '../helpers/errorFilter'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import emailSender from '../helpers/emailSender'

const { sendVerification, sendWellcomeEmail } = emailSender
const { errSignUp } = errorfilter

export default {

  loginWeb (req, res) {
    if (req.body.email) {
      User.find({ email: req.body.email})
      .then(data => {
        if (data.length == 1) {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            if (data[0].verified === 1) {
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
              res.status(403).json({
                status: 'failed',
                message: 'You need to verified your account'
              })
            }
          } else {
            res.status(500).json({
              status: 'failed',
              message: 'Wrong password or email'
            })
          }
        } else {
          res.status(404).json({
            status: 'failed',
            message: 'Wrong password or email'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
    } else {
      console.log(req.body.username === 'gandryeanb1')
      User.find({ username: req.body.username})
      .then(data => {
        if (data.length == 1) {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            if (data[0].verified === 1) {
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
              res.status(403).json({
                status: 'failed',
                message: 'You need to verified your account'
              })
            }
          } else {
            res.status(500).json({
              status: 'failed',
              message: 'Wrong password or email'
            })
          }
        } else {
          res.status(404).json({
            status: 'failed',
            message: 'Wrong password or email'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
    }
    
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

        let verifyToken = jwt.sign({
          email: data.email
        }, process.env.HASH_JWT)
        sendWellcomeEmail(data.email, data.fname)
        sendVerification(data.email, data.fname, verifyToken)

        res.status(201).json({
          status: 'success',
          message: 'creating account success, please verify your email and login',
          data: data
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
          message: errMsg
        })
      })
  }
}