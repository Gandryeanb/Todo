$(document).ready(() => {
  let token = localStorage.getItem('token')
  if (token) {
    fetchData()
    fetchbackgroud()
    fetchDetailTime()
    fetchWeather()
  } else {
    window.location.href = './'
  }
})

let host = 'https://api-todo.gandryeanb.com'

$('#dueDateCreate').calendar({
  type: 'date'
})
$('#dueDateUpdate').calendar({
  type: 'date'
})

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
          fetchWeatherAppend(response.data.weather[0].description, response.data.name)
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

function fetchWeatherAppend (status, loc) {
  let newStatus = status[0].toUpperCase() + status.slice(1)
  $('#openWeather').empty()
  $('#openWeather').append(`
    <p style="margin-top:-50px; color: white; font-size: 30px; padding: 0x; margin: -10px 0px;" >${newStatus}</p>
    <p style="margin-top:-50px; color: white; font-size: 20px; padding: 0x; margin: 0px;" >${loc}</p>
  `)
}

function fetchDetailTime () {
  setInterval(function(){
    $('#detailTime').empty()
    $('#detailTime').append(`
      ${new Date().getHours()} : ${new Date().getMinutes()} 
    `)
  }, 1000)
}

function fetchbackgroud () {
  $.ajax({
    url: 'https://picsum.photos/1920/1080/?random',
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(response => {
      // console.log(response)
    })
    .fail(err => {
      console.log(err)
    })
}

function fetchData () {
  $.ajax({
    url: `${host}/task/asc`,
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(response => {
      let num = 0
      $('#cardsStack').empty()
      $('#sideNavCards').empty()
      $('#sideNavCards').append(`
        <a class="active item">
          <h2 style="color: teal">List Task</h2>
        </a>
      `)
      $('#completed').empty()
      $('#completed').append(`
        <a class="active item">
          <h3 style="color: teal">Recently<br>Completed task</h3>
        </a>
      `)
      $('#denied').empty()
      $('#denied').append(`
        <a class="active item">
          <h3 style="color: teal">Recently<br>Denied task</h3>
        </a>
      `)
      let deniedRecently = []
      let completedRecently = []
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      response.data.forEach(task => {
        if (new Date(task.dueDate).getDate() < new Date().getDate() && new Date(task.dueDate).getMonth() < new Date().getMonth()+1 && Number(new Date(task.dueDate).getFullYear()) <= Number (new Date().getFullYear()) && task.done == 0) {
          deniedRecently.push(task)
          if (deniedRecently.length > 4) {
            deniedRecently.pop()
          }
        } else if (task.done === 0) { 
          let idNumPriority = 'priority'+num
          let date = new Date(task.dueDate).getDate()
          let month = monthNames[new Date(task.dueDate).getMonth()]
          let year = new Date(task.dueDate).getFullYear()
          $('#cardsStack').append(`
          <div class="ui card">
            <div class="content">
              <div class="ui grid">
                <div class="ui thirteen wide column">
                  <div class="header" style="color: teal"><h3>${task.title}</h3></div>
                </div>
                <div class="ui one wide column" id="priority${task._id}">
                  
                </div>
              </div>
            </div>
            <div class="content">
              <h4 class="ui sub header" style="color: teal">Activity</h4>
              <div class="ui small feed">
                <div class="event">
                  <div class="content">
                    <div class="summary">
                      <p>${task.description}</p>
                    </div>
                  </div>
                </div>
                <h4 class="ui sub header" style="color: teal">Due date</h4>
                <div class="event">
                  <div class="content">
                    <div class="summary">
                      <p>${date} ${month}, ${year}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ui bottom attached buttons">
              <div class="ui icon button" onclick="removeTask('${task._id}')">
                <i class="trash icon"></i>
              </div>
              <div class="ui icon button" onclick="detailModal('${task.title}', '${task.description}','${task.priority}', '${date}', '${month}', '${year}', '${task._id}')">
                <i class="search icon"></i>
              </div>
              <div class="ui icon button" onclick="done('${task._id}')">
                <i class="check icon"></i>
              </div>
            </div>
          </div>
          `)
          if (task.priority <= 2) {
            $('#sideNavCards').append(`
              <a class="item">    
                <div class="ui small yellow label">${task.priority}</div>
                ${task.title}
              </a>
            `)
            $(`#priority${task._id}`).append(`
              <div class="ui small yellow label">
                <h5>${task.priority}</h5>
              </div>
            `)
          } else if (task.priority == 5) {
            $('#sideNavCards').append(`
              <a class="item">    
                <div class="ui small red label">${task.priority}</div>
                ${task.title}
              </a>
            `)
            $(`#priority${task._id}`).append(`
              <div class="ui small red label">
                <h5>${task.priority}</h5>
              </div>
            `)
          } else {
            $('#sideNavCards').append(`
            <a class="item">    
              <div class="ui small orange label">${task.priority}</div>
              ${task.title}
            </a>
            `)
            $(`#priority${task._id}`).append(`
              <div class="ui small orange label">
                <h5>${task.priority}</h5>
              </div>
            `)
          }
          num++
        } else {
          completedRecently.push(task)
          if (completedRecently.length > 4) {
            completedRecently.pop()
          }
        }
      })
      if (completedRecently.length != 0) {
        completedRecently.forEach(task => {
          $('#completed').append(`
            <a class="item">
              ${task.title}
            </a>
          `)
        })
      }
      if (deniedRecently.length != 0) {
        deniedRecently.forEach(task => {
          $('#denied').append(`
            <a class="item">
              ${task.title}
            </a>
          `)
        })
      }
    })
    .fail(err => {
      console.log(err)
    })
}

function done (id) {
  $.ajax({
    url: `${host}/task/done/${id}`,
    method: 'PUT',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(response => {
      fetchData()
    })
    .fail(err => {
      console.log(err)
    })
}

function detailModal (title, description, priority, date, month, year, id) {
  $('#titleDetail').empty()
  $('#titleDetail').append(`
  <label>Title :</label>
  ${title}
  `)
  $('#descriptionDetail').empty()
  $('#descriptionDetail').append(`
  <label>Description :</label>
  ${description}
  `)
  $('#priorityDetail').empty()
  $('#priorityDetail').append(`
  <label>Priority :</label>
  ${priority}
  `)
  $('#dueDateDetail').empty()
  $('#dueDateDetail').append(`
  <label>Due Date :</label>
  ${date} ${month}, ${year}
  `)
  $('#actionDetail').empty()
  $('#actionDetail').append(`
    <div class="ui deny button">Dismiss</div>
    <div class="ui deny teal button" onclick="editModal('${title}', '${description}', '${priority}', '${date} ${month}, ${year}', '${id}')">Edit task</div>
  `)
  $('.ui.tiny.modal.detail').modal('show')
}

function editModal(title, description, priority, date, id) {
  $('#titleUpdate').val(title)
  $('#descriptionUpdate').val(description)
  $('#priorityUpdate').val(priority)
  $('#dueDateUpdateInput').val(date)
  $('#actionUpdate').empty()
  $('#actionUpdate').append(`
    <div class="ui deny button">Cancel</div>
    <div class="ui deny teal button" onclick="update('${id}')">Update task</div>
  `)
  $('.ui.tiny.modal.update').modal('show')
}

function update (id) {
  let data = {
    title : $('#titleUpdate').val(),
    priority : $('#priorityUpdate').val(),
    dueDate : new Date($('#dueDateUpdateInput').val()),
    description : $('#descriptionUpdate').val(),
    userId : localStorage.getItem('token')
  }

  $.ajax({
    url: `${host}/task/${id}`,
    method: 'PUT',
    headers: {
      token: localStorage.getItem('token')
    },
    data : data
  })
    .done(response => {
      fetchData()
    })
    .fail(err => {
      console.log(err)
    })
}

function removeTask(id) {
  $.ajax({
    url: `${host}/task/${id}`,
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(response => {
      fetchData()
    })
    .fail(err => {
      console.log(err)
    })
}

function logout () {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  window.location.href = './'
}

function createModal () {
  $('.ui.small.modal.create').modal('show')
}

function create () {
  let data = {
    title : $('#titleCreate').val(),
    priority : $('#priorityCreate').val(),
    dueDate : new Date($('#dueDaceCreateInput').val()),
    description : $('#descriptionCreate').val(),
    userId : localStorage.getItem('token')
  }
  $.ajax({
    url: `${host}/task`,
    method: 'POST',
    headers: {
      token: localStorage.getItem('token')
    },
    data: data
  })
    .done(response => {
      fetchData()
    })
    .fail(err => {
      console.log(err)
    })
}

