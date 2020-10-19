const Repository = require('../models/Repository');

module.exports = 
class BookmarksController extends require("./Controller.js"){
    constructor(req, res){
        super(req, res);
        this.BookmarksRepository = new Repository('Bookmarks');
    }

    //GET: /api/bookmarks
    //GET: /api/bookmarks?sort={name}
    //GET: /api/bookmarks?sort={category}
    //GET: /api/bookmarks/{id}
    //GET: /api/bookmarks?name={nom}
    //GET: /api/bookmarks?name={ab*}
    //GET: /api/bookmarks?
    get(id){
        if(!isNaN(id))
            this.response.JSON(this.BookmarksRepository.get(id));
        else if(this.getQueryStringParams() != null){
            if(Object.size(this.getQueryStringParams()) !== 0)
            {
                const Params = this.getQueryStringParams();
                console.log("Params")
                for (var key in Params) {
                    console.log(key + " : " + Params[key]);
                    console.log(Object.size(Params))
                    if((key.toLocaleLowerCase().localeCompare("sort")!==0 
                        && key.toLocaleLowerCase().localeCompare("name") !== 0 
                        &&  key.toLocaleLowerCase().localeCompare("category") !== 0 )
                        || Object.size(Params) !==1 )
                            throw "Get_error - Paramètres fournis sont invaldies";
                    
                  }
                var bookmarkArray=this.BookmarksRepository.getAll()
                for (var key in Params) {
                    if(bookmarkArray !== -1 && bookmarkArray !== 0)
                    {
                        bookmarkArray = this[key.toLocaleLowerCase()](bookmarkArray,Params[key].replace(/\s/g, ''));
                        if(bookmarkArray === -1)
                        throw "Get_error - Paramètres fournis sont invaldies";
                        else if(bookmarkArray === 0)
                        throw "Get_error - Paramètres fournis sont invaldies";

                    }
                }
    
                if(bookmarkArray !== -1 && bookmarkArray !== 0)
                    this.response.JSON(bookmarkArray);
                
            }
            else
            {
                this.response.JSON({
                    "Params":
                    {
                        "sort":{
                            "Valeur":["name","Category"],
                            "Descritpion":"Les bookmarks sont triés par leur nom de manière ascendant ou par leur category de manière descendant."
                        },
                        "name":{
                            "Type":"String",
                            "Description":"Aller chercher un bookmark pas son nom. Si le string est écris ainsi {'ab*'}, les bookmarks dont le nom débutant par 'ab' seront pris."
                        },
                        "category":{
                            "Type":"String",
                            "Description":"Aller chercher les bookmarks pas leur categorie."
                        },

                    }
                })
            }
           
        }
        else
            this.response.JSON(this.BookmarksRepository.getAll());
        
        
    }

    sort(bookmarksArray,SortBy){
        
        function compareCat(a,b){
            
                const markA = a.Category.toUpperCase();
                const markB = b.Category.toUpperCase();
            

            let comparison = 0;
            if (markA > markB) {
              comparison = 1;
            } else if (markA < markB) {
              comparison = -1;
            }
            return comparison;
        }    
        function compareName(a,b){
            
            const markA = a.Name.toUpperCase();
            const markB = b.Name.toUpperCase();
        

        let comparison = 0;
        if (markA > markB) {
          comparison = 1;
        } else if (markA < markB) {
          comparison = -1;
        }
        return comparison;
        }  

        if(SortBy.toLocaleLowerCase().localeCompare("name") ===0)
            var compare = compareName;
        else if (SortBy.toLocaleLowerCase().localeCompare("category") ===0)
            var compare = compareCat;
        else
            return -1;
        return bookmarksArray.sort(compare);


    }

    name(bookmarksList,nameToSearch){
        var sortedMarksArray= new Array();
        if(nameToSearch.indexOf('*') > -1){
            var startofName = nameToSearch.substring(0,nameToSearch.indexOf('*')).toLocaleLowerCase();
            
            var i = 0;
            bookmarksList.forEach(tempbookmark => {
                if(tempbookmark.Name.substring(0,startofName.length).toLocaleLowerCase().localeCompare(startofName) === 0){
                    sortedMarksArray[i] = tempbookmark;
                    i++;
                }
            });
            return sortedMarksArray.length>0 ?sortedMarksArray : 0  ;
        }  
        else
        {
            bookmarksList.forEach(tempbookmark => {
                if(tempbookmark.Name.toLocaleLowerCase().localeCompare(nameToSearch.toLocaleLowerCase()) === 0){
                    sortedMarksArray[0] =  tempbookmark
                }
            });
            return sortedMarksArray.length>0 ? sortedMarksArray : 0  ;
            
        }
        
    }

    category(bookmarksList,CategoryToSearch){
            var sortedMarksArray= new Array();
            var i = 0;
            bookmarksList.forEach(tempbookmark => {
                if(tempbookmark.Category.toLocaleLowerCase().localeCompare(CategoryToSearch.toLocaleLowerCase()) === 0){
                    sortedMarksArray[i] = tempbookmark;
                    i++;
                }
            });
        return sortedMarksArray;
    }

    //POST : /api/bookmarks	body payload[{"Id":..., "Name": "...", "Url": "...", "Category": "..."}]
    post(bookmark){
      if(this.validateBookmark(bookmark))
      {
        let newBookmark = this.BookmarksRepository.add(bookmark);
        if (newBookmark)
            this.response.created(JSON.stringify(newBookmark));
        else
            throw "post_error - Échec de l'Ajout";
      }
    }
    ///PUT: /api/bookmarks/Id	
    put(bookmark){
        if(this.validateBookmark(bookmark,true))
      {
        if (!this.BookmarksRepository.update(bookmark))
            this.response.ok();
        else 
            throw "put_error - Échec de la modification";
      }
        this.response.res.end();
    }

      // DELETE: api/contacts/{id}
      remove(id){
        if (this.BookmarksRepository.remove(id))
            this.response.accepted();
        else
            throw "remove_error - Échec de la supprimation";
            
            this.response.res.end();
    }

    validateBookmark(bookmark,ignoreName=false){
        if(bookmark !==null)
        if(!('Id' in bookmark) ||!('Name' in bookmark)  || !('Url' in bookmark)  || !('Category' in bookmark))
                    return false;
            else
                if(Object.size(bookmark) > 4)
                    return false;
                else
                    if(!bookmark['Name'] || !bookmark['Url'] || !bookmark['Category'])
                        return false;
                    else
                        if(this.name(this.BookmarksRepository.getAll(),bookmark.Name) !== 0 && !ignoreName){
                            return false;
                        }
                        else
                        {
                           return true;
                        }
    }

  
}

Object.size = function(obj) {
    var size = 0;
    size = Object.keys(obj).length;
    return size;
};