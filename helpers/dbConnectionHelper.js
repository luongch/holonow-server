const mongoose = require('mongoose')
var uri = 'mongodb+srv://holonow_admin:a123456@sandbox.qxqec.mongodb.net/holonow?retryWrites=true&w=majority'

module.exports = class dbConnectionHelper {
    constructor() {
        mongoose.set('useFindAndModify', false);
        mongoose.connect(uri, function (error) {
            if (error) throw error; // Handle failed connection
            console.log('conn ready:  '+mongoose.connection.readyState);        
        })
        .catch((error)=>{
            console.log("error from connect", error)
        })
    }
}