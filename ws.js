const { Server } = require('ws');

function ws(server){
    this.socket = new Server({ server });
    this.on('connection', this.onconnect.bind(this))
    console.log('Web socket initiated!')
}

ws.prototype.on = function(event, callback){
    this.socket.on(event, callback)
}

ws.prototype.onconnect = function(ws){
    console.log('Client connected!');
    ws.on('close', this.ondisconnect)

    if(!this._pollingStarted){
        this.startPolling()
    }
}

ws.prototype.ondisconnect = function(){
    console.log('Client disconnected!');
}

ws.prototype.startPolling = function(){
    this._pollingStarted = true
    const socket = this.socket
    setInterval(() => {
        socket.clients.forEach((client) => {
            client.send(new Date().toTimeString());
        });
    }, 1000);
}


module.exports = ws