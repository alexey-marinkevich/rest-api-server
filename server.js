const http = require('http')

const server = http.createServer((req, res) => {
  console.log(req.url)
  res.write(`${req.url}`)
  res.end()
});

server.listen(3000, 'localhost', () => {
  console.log('server is listening')
})