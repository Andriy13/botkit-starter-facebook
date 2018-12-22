//var env = require('node-env-file');
//env(__dirname + '/.env');

if (!process.env.page_token) {
    console.log('Error: Specify a Facebook page_token in environment.');
    usage_tip();
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log('Error: Specify a Facebook verify_token in environment.');
    usage_tip();
    process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.facebookbot({
    debug: false,
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
    bestbuy_api: process.env.bestbuy_api,
    receive_via_postback: true,
});


// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Tell Facebook to start sending events to this application
require(__dirname + '/components/subscribe_events.js')(controller);

// Set up Facebook "thread settings" such as get started button, persistent menu
require(__dirname + '/components/thread_settings.js')(controller);

// Send an onboarding message when a user activates the bot
require(__dirname + '/components/onboarding.js')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});


var shop_elements;
require(__dirname+'/components/shop_elements')().then((value)=>{shop_elements=value});

var convo_messages=require(__dirname+'/components/convo_messages');

var database=require(__dirname+'/components/database');
database.init();
var bot = controller.spawn({
});

controller.on('facebook_referral',async function(bot,message){
    if(message.payload ==='get_started_payload'){
        if(message.referral!=undefined){
            await database.update_invite(message.user,message.referral.ref);
        }
        bot.reply(message,convo_messages.Menu);
    }else{
        if(message.referral!=undefined){
            database.update_invite(message.user,message.referral.ref);
        }
        bot.reply(message,'You already joined this page');
        bot.reply(message,convo_messages.Menu);
    }

});

controller.on('message_received', async function(bot, message) {
    //console.log(message);
    if(message.payload ==='get_started_payload'){
        if(message.referral!=undefined){
            await database.update_invite(message.user,message.referral.ref);
            bot.reply(message,'Welcome!');
        }
        bot.reply(message,convo_messages.Menu);   
    }else if(message.payload ==='main_menu')
    {
        bot.reply(message,convo_messages.Menu);
    }else if(message.message!=undefined){


        if(message.message.quick_reply.payload==='menu_shop'){
            bot.reply(message, convo_messages.Catalogue(shop_elements));
        }
        
        else if(message.quick_reply.payload==='menu_favs'){
            let elements=await convo_messages.Favorite_Menu(message.user,database);
            console.log(elements);
            if(!elements.length)
            {
                bot.reply(message,'You have no favorites yet');
            }else{
                bot.reply(message, await convo_messages.Catalogue(elements));
            }
        
        }

        else if(message.quick_reply.payload==='menu_purchases'){
            let elements=await convo_messages.Orders_Menu(message.user,database);
            console.log(elements);
            if(!elements.length)
            {
                bot.reply(message,'You have no order history yet');
            }else{
                bot.reply(message, await convo_messages.Catalogue(elements));
            }
        }

        else if(message.quick_reply.payload==='menu_invite'){
            let code= await database.new_invite(message.user);
            let url=`http://m.me/${message.page}?ref=${code}`;
            bot.reply(message,convo_messages.Share_Invite(url));
        }
    }
});

controller.on('facebook_postback',async function(bot, message){
    //console.log(message);
    if(message.raw_message.postback.title==='Start shopping')
    {
       bot.reply(message,await convo_messages.Item_Description(message.raw_message.postback.payload));
    } else if(message.raw_message.postback.payload==='menu_shop'){
        bot.reply(message, convo_messages.Catalogue(shop_elements));
    }else if(message.raw_message.postback.title==='Buy now'){
        var sku=message.raw_message.postback.payload;
          bot.createConversation(message,function(err,convo){
            var phone;
            convo.ask({
                "text":"Please provide your phone number.",
                "quick_replies":[{
                "content_type":"user_phone_number"
                }]
              },function(response, convo){
                if(response.text.length<12||response.text[0]!='+'){
                    bot.reply(message,'Please provide valid phone number using contry code');
                    convo.repeat();
                }
                phone=response.text;
                convo.next();
              });
              convo.ask({
                "text":"Please share your location.",
                "quick_replies":[{
                "content_type":"location"
                }]
              },async function(response, convo){
                console.log(response.attachments[0].payload.coordinates)
                var lat=response.attachments[0].payload.coordinates.lat;
                var long=response.attachments[0].payload.coordinates.long;
                database.add_order(message.user,sku,lat,long,phone);
                convo.say('Thank you for doing this');
                convo.next();
              });
              convo.activate();
          });
    }else if(message.raw_message.postback.title==='Add to favorites'){
        let sku=message.raw_message.postback.payload;
        let result=await database.add_favorite(message.user,sku);
        console.log(result);
        if(result===0){
            bot.reply(message,'Added to favorites');
        } else if(result===1){
            bot.reply(message,'You already have this item in favorites');
        }
    }else if(message.raw_message.postback.title==='Delete'){
        let sku=message.raw_message.postback.payload;
        await database.delete_favorite(message.user,sku);
        bot.reply(message,'Item removed from favorites');
    }
});
