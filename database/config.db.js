const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect( process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('BD conectada');
    } catch (error) {
        throw new Error('Error a la hora de inicar la BD');
    }
}

module.exports = {
    dbConnection
}