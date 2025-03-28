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

//add the cloudinary Configuration and multer step
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

//ejs set
app.set('view engine', 'ejs');


// setup a port
const HTTP_PORT = process.env.PORT || 1000; 

//cloudinary configuration
cloudinary.config({
    cloud_name: 'dfdbhch63',
    api_key: '248556127591652',
    api_secret: 'DRXP9oASPRH3b1zFxs1oc1B828A',
    secure: true
   })


//middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Start the server only after initializing the content service
contentService.initialize()
    .then(() => {
        console.log("Content service initialized successfully.");
    })
    .catch((err) => {
        console.log(`Failed to initialize content service: ${err}`);
    });

// Route to home
app.get('/', (req , res) =>{
      res.redirect('/about');
});


// Set route for about page
app.get("/about", (req, res) => {
    res.render('about', {title: 'About'})
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

 app.get('/articles', (req, res) => {
     // Extract query parameters
     const { category, minDate } = req.query;
 
     // If the 'category' query parameter is provided, filter by category
     if (category) {
         contentService.getArticlesByCategory(category)
             .then(articles => res.json(articles))
             .catch(err => res.status(404).json({ message: err }));
     }
     // If the 'minDate' query parameter is provided, filter by minDate
     else if (minDate) {
         contentService.getArticlesByMinDate(minDate)
             .then(articles => res.json(articles))
             .catch(err => res.status(404).json({ message: err }));
     }
     // If no query parameters are provided, return all articles
     else {
        contentService.getAllArticles()
        .then(articles=>res.json(articles))
        .catch(err => res.status(404).json({ message: err }));
     }
 });

 app.get('/article/:id', (req, res) => {
     const articleId = req.params.id; // Extract the article ID from the URL
 
     contentService.getArticleById(articleId)
         .then(article => res.json(article)) // Return the found article as JSON
         .catch(err => res.status(404).json({ message: err })); // Handle errors if not found
 });

 app.get('/articles/add', (req, res) => {
     res.render('addArticle', {title: 'Add Article'});
     })
 


const upload = multer(); // No disk storage, files are stored in memory

// Route to handle form submissions for adding new articles
app.post('/articles/add', upload.single("featureImage"), (req, res) => {
    
     // Check if a file was uploaded
     if (req.file) {
         // Function to upload the image to Cloudinary using a stream
         let streamUpload = (req) => {
             return new Promise((resolve, reject) => {
                 let stream = cloudinary.uploader.upload_stream(
                     (error, result) => {
                         if (result) resolve(result); // Resolve promise with result if successful
                         else reject(error); // Reject if there's an error
                     }
                 );
                 // Convert the uploaded file buffer to a readable stream and pipe it to Cloudinary
                 streamifier.createReadStream(req.file.buffer).pipe(stream);
             });
         };
 
         // Async function to handle the upload and return the uploaded image URL
         async function upload(req) {
             let result = await streamUpload(req);
             return result;
         }
 
         // Upload the image and then process the article with the image URL
         upload(req)
             .then((uploaded) => {
                 processArticle(uploaded.url); // Call function with uploaded image URL
             })
             .catch(err => res.status(500).json({ message: "Image upload failed", error: err }));
     } else {
         // If no image is uploaded, process the article with an empty image URL
         processArticle("");
     }
 
     // Function to process the article data and save it using contentService
     function processArticle(imageUrl) {
         req.body.featureImage = imageUrl; // Assign image URL to request body
 
         // Call the content service to add the article
         contentService.addArticle(req.body)
             .then(() => res.redirect('/articles')) // Redirect to articles page on success
             .catch(err => res.status(500).json({ message: "Article creation failed", error: err }));
     }
 });
 


// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`Express http server listening on port ${HTTP_PORT}`));
