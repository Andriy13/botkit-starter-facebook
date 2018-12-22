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
    let ids=[];
    let listLoader=await require(__dirname+"/modules_bestbuy/list-loader");
    orders.forEach(async function(element){
        ids.push(element.sku);   
    });
    let items=await listLoader.loadDetails(ids);
    console.log(items);
    for(let i=0;i<orders.length;i++){
         await list.push({
            "title":"Product ID: "+orders[i].sku+", Order date: "+orders[i].timestamp,
            "image_url":items[i][0].image,
            "subtitle":'Total price: '+orders[i].amount+"$, coordinates: "+orders[i].lat+", "+orders[i].long+", Phone: "+orders[i].phone,
            "buttons":[
            {
                "type":"postback",
                "title":"Back",
                "payload":"main_menu"
            }]      
        });
    }
   
    console.log(list);
    return list;
}

function Share_Invite(url){
    let text={
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"Test page",
                    "subtitle":"Click Share to invite your friend",
                    "image_url":"https://scontent.flwo1-1.fna.fbcdn.net/v/t1.0-1/p200x200/47156807_1928305914145862_3333660663472979968_n.png?_nc_cat=101&_nc_ht=scontent.flwo1-1.fna&oh=c36b3948eb04224f23c67d537cee21eb&oe=5C8E6ACD",
                    "buttons": [
                      {
                        "type": "element_share",
                        "share_contents": { 
                          "attachment": {
                            "type": "template",
                            "payload": {
                              "template_type": "generic",
                              "elements": [
                                {
                                  "title": "Test",
                                  "subtitle": "For bot testing",
                                  "image_url": "https://scontent.flwo1-1.fna.fbcdn.net/v/t1.0-1/p200x200/47156807_1928305914145862_3333660663472979968_n.png?_nc_cat=101&_nc_ht=scontent.flwo1-1.fna&oh=c36b3948eb04224f23c67d537cee21eb&oe=5C8E6ACD",
                                  "default_action": {
                                    "type": "web_url",
                                    "url": url
                                  },
                                  "buttons": [
                                    {
                                      "type": "web_url",
                                      "url": url, 
                                      "title": "Join"
                                    }
                                  ]
                                }
                              ]
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
    };
    return text;
}

module.exports={
   Menu,
   Catalogue,
   Item_Description,
   Favorite_Menu,
   Orders_Menu,
   Share_Invite
}