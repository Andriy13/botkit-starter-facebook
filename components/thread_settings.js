var debug = require('debug')('botkit:thread_settings');



module.exports = function(controller) {

    debug('Configuring Facebook thread settings...');
    controller.api.thread_settings.greeting('locale: default, text: Hello, {{user_first_name}}. ,locale: ru_RU, text: Привет, {{user_first_name}}. ,locale: uk_UA, text: Привіт, {{user_first_name}}.');
    controller.api.thread_settings.get_started('get_started_payload');
    controller.api.thread_settings.menu([
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [    
                /*{
                  "type":"nested",
                  "title":"Botkit Docs",
                  "call_to_actions": [
                      {
                        type: "web_url",
                        "title": "Facebook Docs",
                        "url":"https://github.com/howdyai/botkit/blob/master/docs/readme-facebook.md",
                        "webview_height_ratio":"full",
                      },
                      {
                        type: "web_url",
                        "title": "Main Readme",
                        "url":"https://github.com/howdyai/botkit/blob/master/readme.md",
                        "webview_height_ratio":"full",
                      }                    

                  ]
                },*/
                {
                    "type":"postback",
                    "title":"Main menu",
                    "payload":"main_menu"
                },
                {
                    "type":"postback",
                    "title":"Catalogue",
                    "payload":"catalogue"
                },
            ]
        }]);
}
