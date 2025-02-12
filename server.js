console.log("Eda Nur Yilmaz - 119266237");

//path 
const path = require("path")

// "require" the Express module
const express = require('express'); 


// instantiate the "app" object
const app = express(); 

// setup a port
const HTTP_PORT = process.env.PORT || 1000; 


//middleware to serve static files from the "public" folder
app.use(express.static('public'));


// Route to redirect "/" to "/about"
app.get('/', (req , res) =>{
     res.redirect('/about');
});


// Set route for about page
app.get("/about", (req, res) => {
     var htmlPath = path.join(__dirname, "/views/about.html");
     res.sendFile(htmlPath);
 });

 app.get('/categories' , (req,res)=>{
     var htmlPath = path.join(__dirname, "/views/about.html");
     res.sendFile(htmlPath);
 })

 app.get('/articles' , (req,res)=>{
     var htmlPath = path.join(__dirname, "/views/about.html");
     res.sendFile(htmlPath);
 })


// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`Express http server listening on port ${HTTP_PORT}`));
