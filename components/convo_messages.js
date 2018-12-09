var Menu={"text": "Main menu",
 "quick_replies": [
     {
         "content_type": "text",
         "title": "My purchases",
         "payload": "menu_purchases"
     },
     {
         "content_type": "text",
         "title": "Shop",
         "payload": "menu_shop"
     },
     {
         "content_type": "text",
         "title": "Favorites",
         "payload": "menu_favs"
     },
     {
         "content_type": "text",
         "title": "Invite friend",
         "payload": "menu_invite"
     }
 ]};

function Catalogue(list){
    
    var text={
         "attachment":{
            "type":"template",
            "payload":{
                "template_type":"generic",
                "elements":list         
                }
            }
    }
    return text;
}

module.exports={
   Menu,
   Catalogue
}