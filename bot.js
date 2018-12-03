/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Facebook bot built with Botkit.

# RUN THE BOT:
  Follow the instructions here to set up your Facebook app and page:
    -> https://developers.facebook.com/docs/messenger-platform/implementation
  Run your bot from the command line:
    page_token=<MY PAGE TOKEN> verify_token=<MY_VERIFY_TOKEN> node bot.js



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var env = require('node-env-file');
env(__dirname + '/.env');


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
     debug: true,
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
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

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// enable advanced botkit studio metrics
require('botkit-studio-metrics')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});


var bot = controller.spawn({
});



controller.on('facebook_postback', function(bot, message) {
    if(message.payload ==='catalogue')
    {
        bot.reply(message,'No cataloge yet :(');
    }
});
controller.on('facebook_postback', function(bot, message) {
    //bot.reply(message, 'This is the payload selected: ' + message.payload);
    
    if(message.payload ==='main_menu'||message.payload ==='get_started_payload')
    {
        /*bot.startConversation(message, function(err, convo) {
            convo.ask({
                    "text": "Main menu",
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
                            "title": "To invite a friend",
                            "payload": "menu_invite"
                        }
                    ]
                }, function(response, convo) {
                convo.say("Function "+response.text+" is still yet to be added");
                convo.next();
            });
        });*/
        bot.reply(message,{
            "text": "Main menu",
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
                    "title": "To invite a friend",
                    "payload": "menu_invite"
                }
            ]
        });
    }
    switch(message.payload)
    {
        case 'menu_shop': bot.reply(message,'no shop');
    }
});

controller.on('facebook_postback', function(bot, message) {
    switch(message.payload)
    {
        case 'menu_shop': bot.reply(message,'no shop');
    }
});


