const express = require('express');
const app = express();
const live = require('./routes/live')
// const {
//     refreshLiveStreams
// } = require('./controllers/live')

// app.get('/', (req,res)=>{
//     refreshLiveStreams
//     res.send('we are on home')
// });
app.use('/api', live)
app.listen(3000, ()=> {
    console.log('Server is listening on port 3000....')
})  
// const main = async() => {
    
//     // app.get('/live', (req,res)=>{
//     //     res.send(liveStreams)
//     // });    
//     // app.get('/upcoming', async (req,res)=>{
//     //     let upcoming = await dbHelper.getUpcomingLiveStreams();
//     //     res.send(upcoming)
//     // });
      
// }

// main();