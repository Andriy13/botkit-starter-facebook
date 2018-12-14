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
    
    let text={
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

async function Item_Description(item_sku){
    let text;
    let item=await require(__dirname+"/modules_bestbuy/get_detail")(item_sku);
    text={ 
        "attachment":{
        "type":"template",
        "payload":{
            "template_type":"generic",
            "elements":[{
                "title":item[0].name,
                "image_url":item[0].image,
                "subtitle": item[0].shortDescription,
                "default_action": {
                "type": "web_url",
                "url": item[0].url,
                "webview_height_ratio": "tall",
                },
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Buy now",
                        "payload":item[0].sku
                },{
                    "type":"web_url",
                    "url":item[0].url,
                    "title":"Go to website"
                },{
                    "type":"postback",
                    "title":"Go back",
                    "payload":"menu_shop"
                }              
                ]      
              }]
        }
    }
}
        return text;
}

async function Favorite_Menu(id,database){
    let favs=await database.get_favorites(id);
    let ids=[];
    console.log(favs);
    if(!favs){
        return 'no';
    }
    favs.forEach(element=>{
        ids.push(element.sku);
    });
    let listLoader=require(__dirname+'/modules_bestbuy/list-loader')
    let list=new Array;
    let fav_elements=[];
    return listLoader.loadDetails(ids).then(function(value){list=value;}).then(()=>{
        list.forEach((element)=>{
            fav_elements.push({
                "title":element[0].name,
                "image_url":element[0].image,
                "subtitle":'$'+element[0].regularPrice,
                "default_action": {
                "type": "web_url",
                "url": element[0].url,
                "webview_height_ratio": "tall",
                },
                "buttons":[
                {
                    "type":"postback",
                    "title":"Delete",
                    "payload": element[0].sku
                },{
                    "type":"postback",
                    "title":"Back",
                    "payload":"main_menu"
                }              
                ]      
            });
        });
    }).then(()=>{return fav_elements;});   
}

async function Orders_Menu(id,database){
    let orders=await database.get_orders(id);
    let list=[];
    orders.forEach(element=>{
        list.push({
            "title":element.sku+" "+element.timestamp,
            "subtitle":'$'+element.amount+"|| coordinates: "+element.lat+","+element.long+" Phone: "+element.phone,
            "buttons":[
            {
                "type":"postback",
                "title":"Back",
                "payload":"main_menu"
            }]      
        });
    });
    return list;
}

module.exports={
   Menu,
   Catalogue,
   Item_Description,
   Favorite_Menu,
   Orders_Menu
}