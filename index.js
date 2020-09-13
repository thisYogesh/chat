const http = require('http')
const server = http.createServer(function(req, res){
    res.setHeader('content-type', 'text/html')
    res.end(`
        <h1>Hello Yogesh!</h1>
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

server.listen(process.env.PORT || 3000)

const { Server } = require('ws');

const wss = new Server({ server });
wss.on('connection', (ws) => {
    console.log('WS Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
    wss.clients.forEach((client) => {
      client.send(new Date().toTimeString());
    });
}, 1000);