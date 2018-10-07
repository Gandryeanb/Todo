import axios from 'axios'

export default {
  getWeatherStatus (req, res) {
    axios({
      method: 'GET',
      url: `http://api.openweathermap.org/data/2.5/weather?lat=${req.params.lat}&lon=${req.params.lon}&APPID=${process.env.WHEATER_API_KEY}`
    })
      .then(data => {
        let weather = data.data.weather
        let name = data.data.name
        let temp = data.data.main.temp / 9.048235294
        res.status(200).json({
          status: 'success',
          data: { weather, name, temp }
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when get data from open wheater API',
          err: err.message
        })
      })
  }
}