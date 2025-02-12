//built file system 


const path = reqire('path');

let article = [];
let categoried = [];

function initialize(){
    return new Promise ((resolve, reject) =>{
        const categoriesPath = path.join(__dirname,"/categories.json");
        const articlePath = path.join(__dirname, '/article.json');
    })
}

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
  }