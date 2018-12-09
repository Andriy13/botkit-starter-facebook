var bby=require ('bestbuy')(process.env.bestbuy_api);
var helper=require(__dirname+'/error-handler');

module.exports=new Promise((resolve,reject)=>{
    bby.products('categoryPath.id=pcmcat151600050006',{show:'sku'})
    .then(function(data){
        if(!data.total){
            reject(data);
        }
        resolve(data.products);
    }).then(function(value){
        return value;
    }).catch((err)=>
    {
       helper.ShowError(err.data.error);
    });
});
   
   
