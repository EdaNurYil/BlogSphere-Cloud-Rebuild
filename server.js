/*
Eda Nur Yilmaz 
119266237
enyilmaz@myseneca.ca
*/


console.log("Eda Nur Yilmaz - 119266237");

//path 
const path = require("path")

// "require" the Express module
const express = require('express'); 


// instantiate the "app" object
const app = express(); 

//content service module
const contentService = require('./content-service');

// setup a port
const HTTP_PORT = process.env.PORT || 1000; 


//middleware to serve static files from the "public" folder
app.use(express.static('public'));

 //initilize content
 contentService.initialize()
 .then(()=>{
      console.log('Content service initialized successfully.');
 
 })
 .catch((err)=>{
      console.error('Error initializing content service:', err);
 })

// Route to home
app.get('/', (req , res) =>{
    // res.send('Welcome to the Content Service Home Page!');
     res.redirect('/about');
});


// Set route for about page
app.get("/about", (req, res) => {
     var htmlPath = path.join(__dirname, "/views/about.html");
     res.sendFile(htmlPath);
 });

 app.get('/categories' , (req,res)=>{
     contentService.getCategories()
     .then((data) =>{
          res.json(data);
     })
     .catch((err) =>{
          res.json({message:err});
     });
 });

 app.get('/articles' , (req,res)=>{
     contentService.getAllArticles()
     .then((data) =>{
          res.json(data);
     }) 
     .catch((err) => {
          res.json({message: err});
     });
 });

 



// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`Express http server listening on port ${HTTP_PORT}`));
