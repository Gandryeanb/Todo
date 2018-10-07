import axios from 'axios'

export default {
  getQuote (req, res) {
    axios({
      url: 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en',
      method: 'get'
    })
      .then(response => {
        let quote = response.data.quoteText
        let author = response.data.quoteAuthor
        res.status(200).json({
          status: 'success',
          data: {
            quote, author
          }
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when get data from quote API',
          err: err.message
        })
      })
  }
}