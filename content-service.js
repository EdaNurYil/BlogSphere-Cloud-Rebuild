/*
Eda Nur Yilmaz 
119266237
enyilmaz@myseneca.ca
*/

//built file system 
const fs = require("fs");
const path = require('path');

let articles = [];  // Ensure we use `articles` consistently
let categories = []; // Fix spelling from `categoried` to `categories`

// Function to initialize the data
function initialize() {
    return new Promise((resolve, reject) => {
        const categoriesPath = path.join(__dirname, "./data/categories.json");
        const articlesPath = path.join(__dirname, "./data/article.json");

        fs.readFile(articlesPath, "utf8", (err, articleData) => {
            if (err) {
                return reject("Unable to read article file");
            }
            try {
                articles = JSON.parse(articleData);
            } catch (error) {
                return reject("Unable to parse article.json");
            }

            fs.readFile(categoriesPath, "utf8", (err, categoryData) => {
                if (err) {
                    return reject("Unable to read category file");
                }
                try {
                    categories = JSON.parse(categoryData);
                } catch (error) {
                    return reject("Unable to parse category.json");
                }

                // Both files were read successfully
                resolve();
            });
        });
    });
}

// Function to get all published articles
function getPublishedArticles() {
    return new Promise((resolve, reject) => {
        let publishedArticles = articles.filter(article => article.published);
        if (publishedArticles.length === 0) {
            return reject("No results returned");
        }
        resolve(publishedArticles);
    });}

// Function to get all articles
function getAllArticles() {
    return new Promise((resolve, reject) => {
        if (articles.length === 0) {
            return reject("No results returned");
        }
        resolve(articles);
    });
}

// Function to get all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            return reject("No results returned");
        }
        resolve(categories);
    });
}

// Function to add a new article
function addArticle(articleData) {
    return new Promise((resolve, reject) => {
        // Ensure the "published" field is a boolean
        articleData.published = articleData.published ? true : false;

        // Assign a unique ID based on the current length of the articles array
        articleData.id = articles.length + 1;

        // Add the new article to the articles array
        articles.push(articleData);

        // Resolve the promise with the new article data
        resolve(articleData);
    });
}

// Function to get articles by category
function getArticlesByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        // Find the category name based on categoryId
        const category = categories.find(c => c.id == categoryId);
        if (!category) {
            return reject("Category not found");
        }

        // Filter articles by categoryId
        const filteredArticles = articles.filter(article => article.category == categoryId);
        
        if (filteredArticles.length > 0) {
            // Add category name to articles before sending the response
            filteredArticles.forEach(article => {
                article.categoryName = category.name; // Assuming `name` is the category name field
            });
            resolve(filteredArticles);
        } else {
            reject("No results returned");
        }
    });
}

// Function to get articles by minimum date
function getArticlesByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredArticles = articles.filter(article => new Date(article.articleDate) >= minDate);
        
        if (filteredArticles.length > 0) {
            // Add category names to articles
            filteredArticles.forEach(article => {
                const category = categories.find(c => c.id == article.category);
                article.categoryName = category ? category.name : 'Unknown';
            });
            resolve(filteredArticles);
        } else {
            reject("No results returned");
        }
    });
 }

// Function to get an article by ID
function getArticleById(id) {
    return new Promise((resolve, reject) => {
        const foundArticle = articles.find(article => article.id == id);
        if (foundArticle) {
            // Add category name to article
            const category = categories.find(c => c.id == foundArticle.category);
            foundArticle.categoryName = category ? category.name : 'Unknown';
            resolve(foundArticle);
        } else {
            reject("No result returned");
        }
    });
}


// Export all functions
module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories,
    addArticle,
    getArticlesByCategory,
    getArticlesByMinDate,
    getArticleById
};
