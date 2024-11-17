import express from 'express';
import globalRouters from './Routes/globalRouters.js';
// import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', globalRouters);


//DO NOT CHANGE THIS FILE, KEEP THE SAME FOR ALL OF US

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}/api`);
    // URL:  http://localhost:3000/api/CREATED ROUTE
    //for example http://localhost:3000/api/lobby/1 

})
