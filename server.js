const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/files', (req, res) => {
  const data = {
    query: {
      statement: 'SELECT * FROM enaio:object',
      skipCount: 0,
      maxItems: 50
    }
  }
  console.log(data)
  axios.post('https://api.yuuvis.io/dms/objects/search', data,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': '2d425790989b435e96f269df6e3aa168',
      },
    }
  ).then(res2 => {
    console.log('res2', res2)
    res.send(res2.data)
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))