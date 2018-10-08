$(document).ready(() => {
  let token = localStorage.getItem('token')
  if (token) {
    fetchDetailTime()
    fetchWeather()
    fetchQuote()
    greeting()
    fetchData()
  } else {
    window.location.href = './'
  }
})

let host = 'https://api-todo.gandryeanb.com'

function greeting() {
  $('#greeting').empty()
  let hours = new Date().getHours()
  let user = localStorage.getItem('currentUser')

  if (hours >= 5 && hours <= 12) {
    $('#greeting').append(`
      Good Morning, ${user}
    `)
  } else if (hours >= 13 && hours <= 17) {
    $('#greeting').append(`
      Good Afternoon, ${user}
    `)
  } else {
    $('#greeting').append(`
      Good Evening, ${user}
    `)
  }
  
}

function fetchDetailTime () {
  setInterval(function(){
    $('#time').empty()
    $('#time').append(`
      ${new Date().getHours()} : ${new Date().getMinutes()} 
    `)
  }, 1000)
}

function fetchWeather () {
  if (navigator.geolocation) {
    var location_timeout = setTimeout("geolocFail()", 10000)

    navigator.geolocation.getCurrentPosition(function(position) {
      clearTimeout(location_timeout)

      var lat = position.coords.latitude
      var lon = position.coords.longitude

      $.ajax({
        url: `${host}/weather/${lat}/${lon}`,
        method: 'GET',
        headers: {token : localStorage.getItem('token')}
      })
        .done(response => {
          
          fetchWeatherAppend(response.data.weather[0].description, response.data.name, response.data.temp)
        })
        .fail(err => {
          console.log(err)
        })

    }, function(error) {
      clearTimeout(location_timeout)
      console.log('failed when get data wheater status')
    });
  } else {
    console.log('failed when get data wheater status')
  }
}

function fetchWeatherAppend (status, loc, temp) {
  let newStatus = status[0].toUpperCase() + status.slice(1)
  $('#weatherLeft').empty()
  $('#weatherLeft').append(`
    <p style="color: white; font-size: 20px; margin: 0px; padding: 0xp">${loc}</p>
    <p style="color: white; font-size: 15px; margin-bottom: 0px; padding-left: 0px;">${newStatus}</p>
  `)
  $('#weatherRight').empty()
  $('#weatherRight').append(`
  <p style="color: white; font-size: 25px; margin-bottom: 0px; padding: 0xp"> <i class="ui cloud alternate icon" style="color: white"></i> ${String(temp)[0]}${String(temp)[1]}°C</p>
  `)
}

function fetchQuote () {
  $.ajax({
    url: `${host}/quote`,
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    } 
  })
    .done(response => {
      if (response.data.quote) {
        $('#quoteDiv').empty()
        $('#quoteDiv').append(`
          <p style="color: white; font-size: 19px; margin: 0px; padding: 0xp">"${response.data.quote}"</p>
          <p style="color: white; font-size: 15px; margin-bottom: 20px; padding: 0xp">-${response.data.author}</p>
        `)
      }
    })
    .fail(err => {
      console.log(err)
    })
}

function logout () {
  localStorage.removeItem('token')
  localStorage.removeItem('currentUser')
  window.location.href = './'
}

function fetchData () {
  $.ajax({
    url: `${host}/task/asc`,
    method: 'get',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(response => {
      let dataFix = []
      response.data.forEach(task => {
        if (new Date(task.dueDate).getDate() == new Date().getDate() && new Date(task.dueDate).getMonth() == new Date().getMonth() && new Date(task.dueDate).getFullYear() == new Date().getFullYear() && task.done === 0) {
          dataFix.push(task)
          if (dataFix.length >= 4) {
            dataFix.pop()
          }
        }
      })
      if (dataFix.length != 0) {
        $('#todaTask').empty()
        $('#todaTask').append(`
          <p style="font-size: 20px; color: white;">today task :</p>
        `)
        dataFix.forEach(task => {
          $('#todaTask').append(`
            <a href="./home.html"><p style="font-size: 30px; color: white; margin: 0px; padding: 0px">${task.title}</p></a>
          `)
        })
      }
    })
    .fail(err => {
      console.log(err)
    })
}

function create () {
  $.ajax({
    url: `${host}/task`,
    method: 'post',
    headers: {
      token: localStorage.getItem('token')
    },
    data : {
      title : $('#titleCreate').val(),
      priority : 1,
      dueDate : new Date(),
      description : 'undescribed',
      userId : localStorage.getItem('token')
    }
  })
    .done(response => {
      $('#titleCreate').val('')
      fetchData()
    })
    .fail(err => {
      console.log(err)
    })
}

