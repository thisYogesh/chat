const request = require('requester')
const db = require('./js/db')

request.post('/create-user', function(req, res, { payload }){
    res.setHeader('Content-Type', 'application/json')
    
    db
    .create('users', JSON.parse(payload))
    .then(resp => {
        console.log('User added!')
        res.end(JSON.stringify({
            done: true
        }))
    })
    .catch(error => {
        console.log('Unable to add user!')
        res.end(JSON.stringify({
            done: false
        }))
    })
})

db.init()
request.port(8080)