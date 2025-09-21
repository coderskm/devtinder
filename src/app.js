const express = require('express')

const app = express();

app.use("/test",(req, res) => {
    res.send("Hello from the server");
})
app.use("/",(req, res) => {
    res.send("Hello from the server home");
})

app.listen(3000,()=>console.log("server running on PORT 3000"));
