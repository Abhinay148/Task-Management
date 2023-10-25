const connectToMongo=require('./db')
const cors=require('cors')


connectToMongo();

const express = require('express')
const app= express();

const port =5000; 

app.use(cors({origin:true}))

app.use(express.json())

app.use('/api/auth',require('./Routes/auth'))
app.use('/api/notes',require('./Routes/notes'))

app.listen(port,()=>{
    console.log("listening")
}) 