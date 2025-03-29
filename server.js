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

 app.get('/categories', (req, res) => {
    contentService.getCategories()
        .then(categories => {
            res.render('categories', { categories, errorMessage: null });
        })
        .catch(err => {
            res.render('categories', { categories: [], errorMessage: "Error fetching categories or no categories available." });
        });
});

 app.get('/articles', (req, res) => {
    const { category, minDate } = req.query;

    let fetchArticles;

    if (category) {
        fetchArticles = contentService.getAllArticles();
    } else if (minDate) {
        fetchArticles = contentService.getArticlesByMinDate(minDate);
    } else {
        fetchArticles = contentService.getAllArticles();
    }


    fetchArticles
        .then(articles => {
            res.render('articles', { articles, errorMessage: null });
        })
        .catch(err => {
            res.render('articles', { articles: [], errorMessage: "Error fetching articles or no articles available." });
        });
});

app.get('/article/:id', (req, res) => {
    contentService.getArticleById(req.params.id)
        .then(article => res.json(article))
        .catch(err => res.status(404).json({ message: err }));
  });

  app.get('/articles/add', (req, res) => {
    res.render('addArticle');
});
 


const upload = multer(); // No disk storage, files are stored in memory

app.post('/articles/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => { //upload the image to Cloudinary
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream( // create a Cloudinary upload stream
                    (error, result) => {
                        if (result) resolve(result);//resolve the promise with the result
                        else reject(error);// reject the promise if there is an error
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) { //its an async function to uploading the image and returning the uploaded URL
            let result = await streamUpload(req); // its waiting for the image upload to complete
            return result;
        }

        upload(req).then((uploaded) => { //function to call upload function
            processArticle(uploaded.url); //when its uploaded its call processArticle function to process and save it
        }).catch(err => res.status(500).json({ message: "Image upload failed", error: err }));
    } else {
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