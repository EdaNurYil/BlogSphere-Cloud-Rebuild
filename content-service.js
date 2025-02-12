//built file system 
const file = require('fs');

const path = reqire('path');

let article = [];
let categoried = [];

function initialize(){
    return new Promise ((resolve, reject) =>{
        const categoriesPath = path.join(__dirname,"/categories.json");
        const articlePath = path.join(__dirname, '/categories.json');
    })
}

file.readFile(articlePath, 'utf8' , (error,article) => {
    if(error){
        return reject (`Not able to read article.json: ${error}`);
    }
    try{
        articles = JSON.parse(article);

    }catch(parseError){
        return reject (`Error parsing articles.json: ${parseError}`);

    }
})

file.readFile(categoriesPath, 'utf8' , (error,categories) => {
    if(error){
        return reject (`Not able to read categories.json: ${error}`);
    }
    try{
        categories = JSON.parse(categories);

    }catch(parseError){
        return reject (`Error parsing categories.json: ${parseError}`);

    }
})

function getPublishedArticles() {
    return articles.filter(article => article.published);
}

function getCategories() {
    return categories;
  }

  module.export = {
    initialize,
    getPublishedArticles,
    getCategories
  };