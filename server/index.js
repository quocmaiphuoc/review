const express = require('express')
const app = express()
const PORT = 5000
const path = require('path')

const bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'));
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const usersRouter  = require('./routers/usersRouter')
app.use('/users', usersRouter)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})