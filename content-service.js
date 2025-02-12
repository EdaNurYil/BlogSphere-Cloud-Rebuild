//built file system 

const fs = require("fs");
const path = require('path');

let article = [];
let categoried = [];

function initialize(){
    return new Promise ((resolve, reject) =>{
        const categoriesPath = path.join(__dirname,"./data/categories.json");
        const articlePath = path.join(__dirname, './data/article.json');
    
        fs.readFile(articlePath, "utf8", (err,articleData) =>{
            if(err){
                return reject("not able to read file");
            }
            try{
                article = JSON.parse(articleData);
            }catch(error){
                return reject("not able to parse article.json");
            }
            fs.readFile(categoriesPath, "utf8", (err,categoryData) =>{
                if(err){
                    return reject("not able to read file");
                }
                try{
                    categories = JSON.parse(categoryData);
                }catch(error){
                    return reject("not able to parse category.json");
                }
    
                //both file is successfull
                resolve();
             });
      
        });
    });
}


function getPublishedArticles() {
    return new Promise((resolve,reject) =>{
        let publishedArticles = article.filter(article => article.published);
        if (publishedArticles.length === 0){
            return reject("no results returned");
        }
        resolve(publishedArticles);
    });
    
}

function getAllArticles(){
    return new Promise((resolve,reject) =>{
        if(article.length ===0){
            return reject("no results returned");
        }
        resolve(article);
    })
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
          return reject("no results returned");
        }
        resolve(categories);
      });
  }

  module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories
  }