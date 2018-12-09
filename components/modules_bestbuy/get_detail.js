var bby=require ('bestbuy')(process.env.bestbuy_api);
var helper=require(__dirname+'\\error-handler');

module.exports=(sku)=>{
    return new Promise((resolve,reject)=>{
        bby.products(`sku=${sku}`,{show:'sku,name,shortDescription,image,url,regularPrice'})
        .then(function(data){
            resolve( data.products);
        })
        .then(function(value){
            return value;
        }).catch((err)=>
        {
           helper.ShowError(err.data.error);
        });;
    });
}