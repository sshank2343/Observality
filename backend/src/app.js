const express = require('express')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const healthRoutes = require('./modules/health/health.routes'); 



const app =express();

app.use(helmet());
app.use(cors({origin: config.frontendUrl, credentials:true}));
app.use(express.json({limit:'5mb'}))
app.use(morgan(config.nodeEnv === 'developmet'?'dev':'combined'));

app.use('/health',healthRoutes)

app.use((req,res) => {
    res.status(404).json({error : 'Not Found'})
});

app.use((err,req,res,next) => {
    console.error(err);
    res.status(err.status || 500).json({error : err.message || 'Internal Server Error'})
});

module.exports=app;