require('dotenv').config();
const express = require('express');

// console.log(process.env);

const app = express();
const port = process.env.PORT;

app.get('/',(req,res)=> {
    res.send('Hello World!');
});

app.get('/about',(req,res)=> {
    res.send('About Samaul Haque Malik Brother!');
});

app.get('/vision',(req,res)=> {
    res.send('About Samaul Haque Malik Vision!');
});


app.listen(port,()=>{
    console.log(`Lession 2 running on port http://localhost:${port}`);
});