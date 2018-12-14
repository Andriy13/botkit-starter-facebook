var Favorite,Order,FavoriteModel,OrderModel;
var mongoose;
async function init(){
    mongoose = require('mongoose');

    OrderSchema = new mongoose.Schema({
    senderID: { type: String },
    sku: { type: String },
    timestamp: { type: Date, default: Date.now },
    amount: { type: Number, default: 0 },
    lat: { type: String },
    long: { type: String },
    phone: { type: String }
    });

    FavoriteSchema = new mongoose.Schema({
        senderID: { type: String },
        sku: { type: String },
        timestamp: { type: Date, default: Date.now }
    });
    FavoriteModel=mongoose.model('Favorite',FavoriteSchema,'favorites');
    OrderModel=mongoose.model('Order',OrderSchema,'orders');
    let url=process.env.mongo_url.toString();
    await mongoose.connect(url,{useNewUrlParser: true}).catch((err)=>{console.log(err);});
    mongoose.connection.on('open', function() {
    console.log('Mongoose connected.');
    });
    
}

async function add_favorite(id,sku){
    let result;
    let item=await require(__dirname+"/modules_bestbuy/get_detail")(sku);
    let Favorite = new FavoriteModel({
        senderID:id,
        sku: item[0].sku,
        });
    result = await FavoriteModel.find({ senderID:id,sku:item[0].sku }, function(err, fav) {
        if(fav.length){
            console.log('Fav already exists');
        }else{
            Favorite.save(function(err) {
                if (err) throw err;
                console.log('Fav saved successfully!');
                });
        }
    });
    console.log(result)
    return result.length;
}

async function delete_favorite(id,sku){
    let item=await require(__dirname+"/modules_bestbuy/get_detail")(sku);
    FavoriteModel.findOneAndRemove({ senderID:id,sku:item[0].sku},function(err,fav){
        if(err) throw err;
    });
}

async function get_favorites(id){
    return await FavoriteModel.find({ senderID:id},function(err,fav){
        if(err) throw err;
    }).then((value)=>{return value});
}

async function add_order(id,sku,lat,long,phone){
    let amount=await require(__dirname+'/modules_bestbuy/get_detail')(sku);
    console.log(amount);
    let Order=new OrderModel({
        senderID: id,
        sku: sku,
        amount: amount[0].regularPrice,
        lat: lat,
        long: long,
        phone: phone
    });
    Order.save(function(err){
        if(err) throw err;
    });
}

async function get_orders(id){
    return await OrderModel.find({ senderID:id},function(err,fav){
        if(err) throw err;
    }).then((value)=>{return value});
}

module.exports={
    init,
    add_favorite,
    delete_favorite,
    get_favorites,
    add_order,
    get_orders
}