const http = require('http')
http.createServer(function(req, res){
    res.end('Hello Yogesh!')
}).listen(process.env.PORT || 3000)