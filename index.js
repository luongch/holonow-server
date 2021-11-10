const express = require('express');
const app = express();
const live = require('./routes/live')
const DbConnectionHelper = require('./helpers/dbConnectionHelper');
var url = process.env.MONGO_URL

app.use('/api/v1/live', live)

const start = async () => {
    try {
        await DbConnectionHelper(url)
        app.listen(3000, ()=> {
            console.log('Server is listening on port 3000....')
        }) 
    }
    catch (error) {
        console.log(error)
    }
}

start();
 
