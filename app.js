const createServer = require('./utils/server')

const start = () => {
    try {
        const app = createServer()
        app.listen(process.env.PORT || 3001, ()=> {
            console.log(`Server is listening on port ${process.env.PORT || 3001}....`)
        }) 
    }
    catch (error) {
        console.log(error)
    }
}

start();
 
