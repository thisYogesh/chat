const requester = require('requester')
const db = require('./js/db')

// enable asset server
requester.serve(__dirname)

requester.post('/create-user', function(req, res, { payload }){
    res.setHeader('Content-Type', 'application/json')
    
    db
    .create('users', JSON.parse(payload))
    .then(resp => {
        console.log('User added!')
        res
        .writeHead(200)
        .end(JSON.stringify({
            done: true
        }))
    })
    .catch(error => {
        console.log('Unable to add user!')
        res
        .writeHead(500)
        .end(JSON.stringify({
            done: false
        }))
    })
})

db.init()
requester.port(8080)