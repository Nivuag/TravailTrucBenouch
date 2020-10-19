exports.initBookmarks = function (){
    const BookmarksRepository = require('./Repository.js');
    const Bookmark = require('./bookmark');
    const bookmarksRepository = new BookmarksRepository("bookmarks");
    
    if(bookmarksRepository.objectsList.length == 0){
    bookmarksRepository.add(new Bookmark("Colnet","https://portail2.clg.qc.ca/colnet/infocours.asp","Ecole"));
    bookmarksRepository.add(new Bookmark("Moodle","https://clg.moodle.decclic.qc.ca/login/index.php","Ecole"));
    bookmarksRepository.add(new Bookmark("Youtube","https://www.youtube.com/","Divertissement"));
    bookmarksRepository.add(new Bookmark("Facebook","https://www.facebook.com/","Divertissement"));
  
    bookmarksRepository.add({
        Id:0,
        Name:"Google",
        Url:"https://www.google.com/",
        Category:"Recherche"
      });
      bookmarksRepository.add({
        Id:0,
        Name:"Bing",
        Url:"https://www.bing.com/",
        Category:"Recherche"
      });
    }
}