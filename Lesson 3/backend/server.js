import express from 'express';

const app = express();


// app.get('/',(req,res)=>{
//     res.send('Server is ready');
// });

app.get('/api/jokes',(req,res)=>{
    const jokes = [
        { id: 1, title: "Joke 1", content: "Why do programmers prefer dark mode? Because light attracts bugs." },
        { id: 2, title: "Joke 2", content: "Why do Java developers wear glasses? Because they can't C#." },
        { id: 3, title: "Joke 3", content: "How many programmers does it take to change a light bulb? None, that's a hardware problem." },
        { id: 4, title: "Joke 4", content: "Why do programmers hate nature? It has too many bugs." },
        { id: 5, title: "Joke 5", content: "What is a programmer's favorite hangout place? Foo Bar." }
    ];
    res.send(jokes);
});


const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:3000`);
});