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

        // Replace CategoryID with CategoryName for each article
        const articlesWithCategoryNames = articles.map(article => {
            const categoryName = getCategoryNameById(article.category); // Get category name
            return { ...article, category: categoryName }; // Replace the category ID with the category name
        });

        resolve(articlesWithCategoryNames);
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

        // Map CategoryID to CategoryName
        const categoryName = getCategoryNameById(articleData.category); // Get CategoryName
        if (!categoryName) {
            return reject("Invalid category ID");
        }
        articleData.category = categoryName; // Update article to use CategoryName

        // Add the new article to the articles array
        articles.push(articleData);

        // Write the updated articles array back to the file
        const articlesPath = path.join(__dirname, './data/article.json');
        fs.writeFile(articlesPath, JSON.stringify(articles, null, 2), (err) => {
            if (err) {
                reject("Unable to save article data.");
            } else {
                resolve(articleData); // Resolve with the new article data
            }
        });
    });
}



// Function to get articles by category
function getArticlesByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredArticles = articles.filter(article => article.category === category);

        if (filteredArticles.length > 0) {
            // Replace CategoryID with CategoryName for the filtered articles
            const articlesWithCategoryNames = filteredArticles.map(article => {
                const categoryName = getCategoryNameById(article.category);
                return { ...article, category: categoryName };
            });
            resolve(articlesWithCategoryNames);
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
        if (filteredArticles.length > 0) resolve(filteredArticles);
        else reject("No results returned");
    });
}

// Function to get an article by ID
function getArticleById(id) {
    return new Promise((resolve, reject) => {
        const foundArticle = articles.find(article => article.id == id);
        if (foundArticle) resolve(foundArticle);
        else reject("No result returned");
    });
}
function getCategoryNameById(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? {categoryId: category.id, categoryName: category.name} : null; // Return null if the category is not found
}

const getCategoryById = (categoryId) => {
    return new Promise((resolve, reject) => {
        const category = categories.find(cat => cat.id === parseInt(categoryId));
        if (category) {
            resolve(category);
        } else {
            reject("Category not found");
        }
    });
};

// Export all functions
module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories,
    addArticle,
    getArticlesByCategory,
    getArticlesByMinDate,
    getArticleById,
    getCategoryNameById,
    getCategoryById
};