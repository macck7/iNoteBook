const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
const port = process.env.PORT || 5000
app.use(cors())

//example
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// for using json 
app.use(express.json())

// Available routes and linking them with endpoints
//            req               res
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})