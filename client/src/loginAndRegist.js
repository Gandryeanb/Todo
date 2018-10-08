$(document).ready(() => {
  let token = localStorage.getItem('token')
  if (token) {
    window.location = './simple.html'
  }
})

let host = 'https://api-todo.gandryeanb.com'

function login() {
  let usernameOrEmail = $('#emailAndUsername').val()
  let password = $('#password').val()

  if (usernameOrEmail.indexOf('@') != -1) {
    $.ajax({
      url: `${host}/users/login/web`,
      method: 'post',
      json: true,
      data: {
        email: usernameOrEmail,
        password: password
      }
    })
      .done(response => {
        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', response.fname)
        window.location = './simple.html'
      })
      .fail(err => {
        console.log(err)
        $('#notifLogin').empty()
        $('#notifLogin').append('* ' + err.responseJSON.message)
      })
  } else {
    console.log('masuk')
    $.ajax({
      url: `${host}/users/login/web`,
      method: 'post',
      data: {
        username: usernameOrEmail,
        password: password
      }
    })
      .done(response => {
        console.log(response)
        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', response.fname)
        window.location = './simple.html'
      })
      .fail(err => {
        $('#notifLogin').empty()
        $('#notifLogin').append('* ' + err.responseJSON.message)
      })
  }
}

function regist () {
  let data = {
    fname: $('#fname').val(),
    lname: $('#lname').val(),
    username: $('#username').val(),
    email: $('#email').val(),
    password: $('#password').val()
  }

  $.ajax({
    url: `${host}/users/register/web`,
    method: 'post',
    data: data
  })
    .done(response => {
      $('#notifRegist').empty()
      $('#notifRegist').append('* '+ response.message)
    })
    .fail(err => {
      $('#notifRegist').empty()
      $('#notifRegist').append('* '+ err.responseJSON.message[0])
    })
}

function loginGoogle(token) {
  console.log('masuk')
  $.ajax({
    url: `${host}/users/login/google`,
    method: 'get',
    headers: {
      id_token : token
    }
  })
    .done(response => {
      console.log(response)
      localStorage.setItem('token', response.token)
      localStorage.setItem('currentUser', response.fname)
      window.location.href = './simple.html'
    })
    .fail(err => {
      console.log(err)
    })
}