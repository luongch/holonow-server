const mongoose = require('mongoose')

const connectDb = async (uri) => {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useUnifiedTopology', true)
    await mongoose.connect(uri)
    console.log('conn ready:  ' + mongoose.connection.readyState);
}

module.exports = connectDb;
