import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

const userSchema = new Schema({
  fname:  {
    type: String,
    required: [true, 'First name required'],
    validate : {
      validator () {
        let patt = /^[a-zA-Z_ ]+$/
        let result = patt.test(this.fname)
        if (!result) {
          throw new Error('First name must be a character')
        } else if (this.fname.length < 3) {
          throw new Error('First name length must be greater than 3 character')
        }
      }
    }
  },
  lname: {
    type: String,
    validate : {
      validator () {
        if (this.lname) {
          let patt = /^[a-zA-Z_ ]+$/
          let result = patt.test(this.lname)
          if (!result) {
            throw new Error('Last name must be a character')
          } else if (this.lname.length < 3) {
            throw new Error('Last name length must be greater than 3 character')
          }
        }
      }
    }
  },
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: true,
    validate: {
      validator () {
        let patt = /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/
        let result = patt.test(this.username)
        if (this.username.length < 5) {
          throw new Error('Username length must greater than 5 character or number')
        } else if (!result) {
          throw new Error('Username must only contain character or number')
        }
      }
    }
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: {
      validator () {
        let patt = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = patt.test(this.email)
        if (!result) {
          throw new Error('Email is invalid')
        }
      }
    }
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    validate: {
      validator () {
        let patt = /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/
        let result = patt.test(this.password)

        if (this.password.length < 8) {
          throw new Error('Password length must be greater than 8')
        } else if (!result) {
          throw new Error('Password must contain a number and character')
        }
      }
    }
  },
  taskId: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  verified: {
    type: Number,
    default: 0
  },
  loginWeb: {
    type: Number,
    default: 1
  },
  loginFb: {
    type: Number,
    default: 0
  },
  loginGoogle: {
    type: Number,
    default: 0
  }
})

userSchema.post('validate', doc => {
  const hashedPassword = bcrypt.hashSync(doc.password, Number(process.env.HASH_PASSWORD))
  doc.password = hashedPassword
})

const User = mongoose.model('User', userSchema)

export default User