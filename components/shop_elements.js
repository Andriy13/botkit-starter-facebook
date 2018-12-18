

module.exports=()=>{

//Create products list for shop
var shop_elements=[];
var listLoader=require(__dirname+'/modules_bestbuy/list-loader')
var list=new Array;
return listLoader.loadDetails().then(function(value){list=value;}).then(()=>{
    
    list.forEach((element)=>{
        shop_elements.push({
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
                "title":"Start shopping",
                "payload": element[0].sku
            },{
                "type":"postback",
                "title":"Add to favorites",
                "payload":element[0].sku
            }              
            ]      
        });
    });
    
    }).then(()=>{return shop_elements;});   
    
}