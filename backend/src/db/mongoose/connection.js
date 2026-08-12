const mongoose = require('mongoose');
const config = require('../../config');


let isConnected = false;

const connectMongo = async () => {
    if(isConnected) return mongoose.connection;

    try {
        await mongoose.connect(config.mongoUri);
        isConnected = true;
        console.log('MongoDB connected');

        mongoose.connection.on('error', (err)=>{
            console.error('MongoDB conncection error:',err);
        });

        mongoose.connection.on('disconnected',()=>{
            console.warn('MongoDB disconnected');
            isConnected = false;
        })

        return mongoose.connection;
    } catch (err) {
        console.error('Failed to connect to MongoDB:' , err.message);
        process.exit(1)
    }
}

module.exports={connectMongo,mongoose}