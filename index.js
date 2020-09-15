const http = require('http')
const server = http.createServer(function(req, res){
    res.setHeader('content-type', 'text/html')
    res.end(`
        <h1>Hello Yogesh!!</h1>
        <div class='time'></div>

        <script>
            var HOST = location.origin.replace(/^http/, 'ws')
            var ws = new WebSocket(HOST);
            var el;

            ws.onmessage = function (event) {
                el = document.querySelector('.time')
                el.innerHTML = event.data;
            };
        </script>
    `)
});

const PORT = process.env.PORT || 3000
server.listen(PORT, function(){
    console.log('Server is listening on PORT ' + PORT)
})

const ws = require('./ws')
new ws(server)