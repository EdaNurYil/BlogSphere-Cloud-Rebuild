console.log("Eda Nur Yilmaz - 119266237");

//path 
const path = require("path")

// "require" the Express module
const express = require('express'); 

// instantiate the "app" object
const app = express(); 

// setup a port
const HTTP_PORT = process.env.PORT || 3000; 

//set route for index
app.get('/', (req , res) =>{
     var htmlPath = path.join(__dirname, '/views/index.html');
     res.sendFile(htmlPath);
});
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
